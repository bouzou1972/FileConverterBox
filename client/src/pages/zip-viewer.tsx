import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Download, 
  Eye, 
  FileText, 
  Folder, 
  Archive, 
  FileIcon,
  Image,
  Music,
  Video,
  Code,
  FileSpreadsheet,
  RefreshCw,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface ZipEntry {
  name: string;
  isFolder: boolean;
  size: number;
  compressedSize: number;
  date: Date;
  type: string;
  content?: string | ArrayBuffer;
  preview?: string;
}

export default function ZipViewer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zipEntries, setZipEntries] = useState<ZipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ZipEntry | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [showFoldersOnly, setShowFoldersOnly] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileName: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-4 h-4 text-blue-500" />;
    
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      return <Image className="w-4 h-4 text-green-500" />;
    }
    if (['mp3', 'wav', 'flac', 'ogg', 'aac'].includes(ext)) {
      return <Music className="w-4 h-4 text-purple-500" />;
    }
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(ext)) {
      return <Video className="w-4 h-4 text-red-500" />;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs'].includes(ext)) {
      return <Code className="w-4 h-4 text-orange-500" />;
    }
    if (['txt', 'md', 'rtf', 'doc', 'docx', 'pdf'].includes(ext)) {
      return <FileText className="w-4 h-4 text-gray-600" />;
    }
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    }
    
    return <FileIcon className="w-4 h-4 text-gray-400" />;
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    if (['mp3', 'wav', 'flac', 'ogg', 'aac'].includes(ext)) return 'audio';
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(ext)) return 'video';
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs'].includes(ext)) return 'code';
    if (['txt', 'md', 'rtf', 'doc', 'docx', 'pdf'].includes(ext)) return 'document';
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'spreadsheet';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    
    return 'file';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isTextFile = (fileName: string): boolean => {
    const textExtensions = [
      'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx',
      'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'sql',
      'csv', 'yaml', 'yml', 'ini', 'log', 'conf', 'config'
    ];
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return textExtensions.includes(ext);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please select a ZIP file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "Please select a ZIP file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    setZipEntries([]);
    setSelectedEntry(null);
    setPreviewContent("");

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      const entries: ZipEntry[] = [];

      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        const entry: ZipEntry = {
          name: relativePath,
          isFolder: zipEntry.dir,
          size: (zipEntry as any)._data ? (zipEntry as any)._data.uncompressedSize : 0,
          compressedSize: (zipEntry as any)._data ? (zipEntry as any)._data.compressedSize : 0,
          date: zipEntry.date || new Date(),
          type: getFileType(relativePath),
          preview: undefined
        };

        // Generate preview for small text files
        if (!zipEntry.dir && isTextFile(relativePath) && entry.size < 10000) {
          try {
            const content = await zipEntry.async('string');
            entry.preview = content.slice(0, 200).replace(/\n/g, ' ');
          } catch (e) {
            // If preview fails, continue without it
          }
        }

        entries.push(entry);
      }

      setZipEntries(entries);
      setIsLoading(false);

      toast({
        title: "ZIP file loaded",
        description: `Found ${entries.length} items (${entries.filter(e => !e.isFolder).length} files, ${entries.filter(e => e.isFolder).length} folders)`,
      });

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Failed to read ZIP file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const previewFile = async (entry: ZipEntry) => {
    if (!selectedFile || entry.isFolder) return;

    setSelectedEntry(entry);
    setPreviewContent("Loading...");

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(selectedFile);
      const zipEntry = zipData.files[entry.name];

      if (!zipEntry) {
        setPreviewContent("File not found in ZIP archive");
        return;
      }

      if (isTextFile(entry.name)) {
        const content = await zipEntry.async('string');
        setPreviewContent(content);
      } else {
        setPreviewContent(`Binary file (${entry.type}) - ${formatFileSize(entry.size)}\n\nThis file type cannot be previewed as text. Use the download button to extract it.`);
      }

    } catch (error) {
      setPreviewContent(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const downloadFile = async (entry: ZipEntry) => {
    if (!selectedFile || entry.isFolder) return;

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(selectedFile);
      const zipEntry = zipData.files[entry.name];

      if (!zipEntry) {
        toast({
          title: "File not found",
          description: "Could not find file in ZIP archive",
          variant: "destructive",
        });
        return;
      }

      const content = await zipEntry.async('blob');
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = entry.name.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${entry.name}`,
      });

    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const downloadAll = async () => {
    if (!selectedFile) return;

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(selectedFile);
      
      // Create a new ZIP with all files
      const newZip = new JSZip();
      
      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async('blob');
          newZip.file(relativePath, content);
        }
      }

      const content = await newZip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.zip', '') + '_extracted.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Downloading all files as ZIP",
      });

    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setZipEntries([]);
    setSelectedEntry(null);
    setPreviewContent("");
    setSearchTerm("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredEntries = zipEntries
    .filter(entry => {
      if (showFoldersOnly && !entry.isFolder) return false;
      if (searchTerm) {
        return entry.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
          return b.date.getTime() - a.date.getTime();
        default:
          return 0;
      }
    });

  const totalSize = zipEntries.reduce((sum, entry) => sum + entry.size, 0);
  const totalFiles = zipEntries.filter(e => !e.isFolder).length;
  const totalFolders = zipEntries.filter(e => e.isFolder).length;

  const usageExamples = [
    {
      title: "Archive Inspection",
      description: "View ZIP contents without extracting files",
      steps: [
        "Upload ZIP file using the file picker",
        "Browse through all files and folders",
        "Preview text files directly in browser",
        "Check file sizes and compression ratios",
        "Search for specific files by name"
      ],
      tip: "Use search to quickly find files in large archives"
    },
    {
      title: "File Extraction",
      description: "Extract specific files from ZIP archives",
      steps: [
        "Browse ZIP contents to find needed files",
        "Click download button for individual files",
        "Preview text files before downloading",
        "Extract multiple files one by one",
        "Verify file integrity and sizes"
      ]
    },
    {
      title: "Archive Analysis",
      description: "Analyze ZIP structure and compression efficiency",
      steps: [
        "View compression ratios for each file",
        "Check original vs compressed file sizes",
        "Analyze folder structure and organization",
        "Identify file types within the archive",
        "Review modification dates and metadata"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToolSEO
        title="ZIP File Viewer & Extractor"
        description="View ZIP archive contents, preview text files, and extract individual files with complete privacy. Free online ZIP viewer with file extraction capabilities."
        keywords={["zip viewer", "zip extractor", "archive viewer", "zip preview", "file extraction", "zip contents", "archive analysis"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">ZIP File Viewer & Extractor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View the contents of ZIP archives, preview text files, and extract individual files or entire archives. 
          All processing happens in your browser for complete privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload ZIP File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
                id="zip-upload"
              />
              <label htmlFor="zip-upload" className="cursor-pointer">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop ZIP file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 100MB
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Selected File:</h4>
                <p className="text-sm text-gray-600 mb-1">{selectedFile.name}</p>
                <p className="text-sm text-gray-600 mb-3">
                  Size: {formatFileSize(selectedFile.size)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFile}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  {zipEntries.length > 0 && (
                    <Button
                      size="sm"
                      onClick={downloadAll}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Extract All
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Archive Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-900">Total Files</div>
                <div className="text-xl font-bold text-blue-600">{totalFiles}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-900">Folders</div>
                <div className="text-xl font-bold text-green-600">{totalFolders}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded col-span-2">
                <div className="font-semibold text-purple-900">Total Size</div>
                <div className="text-xl font-bold text-purple-600">{formatFileSize(totalSize)}</div>
              </div>
            </div>

            {zipEntries.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="font-semibold text-sm mb-2">File Types</h4>
                <div className="space-y-1">
                  {Object.entries(
                    zipEntries
                      .filter(e => !e.isFolder)
                      .reduce((acc, entry) => {
                        acc[entry.type] = (acc[entry.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Files
              </label>
              <Input
                placeholder="Filter by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'date')}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="date">Date</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="folders-only"
                checked={showFoldersOnly}
                onChange={(e) => setShowFoldersOnly(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="folders-only" className="text-sm">
                Show folders only
              </label>
            </div>

            {searchTerm && (
              <p className="text-sm text-gray-600">
                Showing {filteredEntries.length} of {zipEntries.length} items
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Reading ZIP file contents...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {zipEntries.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Archive Contents ({filteredEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEntries.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedEntry?.name === entry.name ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => !entry.isFolder && previewFile(entry)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getFileIcon(entry.name, entry.isFolder)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate" title={entry.name}>
                          {entry.name}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {!entry.isFolder && (
                            <>
                              <span>{formatFileSize(entry.size)}</span>
                              <Badge variant="outline" className="text-xs">
                                {entry.type}
                              </Badge>
                            </>
                          )}
                        </div>
                        {entry.preview && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {entry.preview}...
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {!entry.isFolder && (
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            previewFile(entry);
                          }}
                          disabled={!isTextFile(entry.name)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(entry);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                File Preview
                {selectedEntry && (
                  <Badge variant="outline" className="ml-2">
                    {selectedEntry.name.split('/').pop()}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEntry ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Size:</span> {formatFileSize(selectedEntry.size)}
                      </div>
                      <div>
                        <span className="font-semibold">Type:</span> {selectedEntry.type}
                      </div>
                      <div>
                        <span className="font-semibold">Compressed:</span> {formatFileSize(selectedEntry.compressedSize)}
                      </div>
                      <div>
                        <span className="font-semibold">Ratio:</span> {selectedEntry.size > 0 ? Math.round((1 - selectedEntry.compressedSize / selectedEntry.size) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  
                  <Textarea
                    value={previewContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Select a text file to preview its contents..."
                  />
                  
                  <Button
                    onClick={() => downloadFile(selectedEntry)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedEntry.name.split('/').pop()}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a file in the archive to preview its contents</p>
                  <p className="text-sm mt-2">Text files can be previewed directly</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {zipEntries.length === 0 && !isLoading && selectedFile && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Empty Archive</h3>
              <p>This ZIP file appears to be empty or could not be read.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Privacy Note:</strong> All ZIP file processing happens entirely in your browser. 
          Files are never uploaded to any server, ensuring complete privacy and security of your data.
        </AlertDescription>
      </Alert>

      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          All processing happens in your browser - your files never leave your device!
        </p>
      </div>
    </div>
  );
}