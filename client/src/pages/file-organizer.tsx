import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  FolderOpen, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Code, 
  FileSpreadsheet,
  Archive,
  FileIcon,
  Calendar,
  SortAsc,
  RefreshCw,
  Info,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface FileInfo {
  file: File;
  name: string;
  size: number;
  lastModified: Date;
  type: string;
  extension: string;
  category: string;
}

interface GroupedFiles {
  [key: string]: FileInfo[];
}

export default function FileOrganizer() {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [organizeBy, setOrganizeBy] = useState<'type' | 'name' | 'date' | 'size'>('type');
  const [groupedFiles, setGroupedFiles] = useState<GroupedFiles>({});
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (extension: string, category: string) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(extension)) {
      return <Image className="w-4 h-4 text-green-500" />;
    }
    if (['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a'].includes(extension)) {
      return <Music className="w-4 h-4 text-purple-500" />;
    }
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
      return <Video className="w-4 h-4 text-red-500" />;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'vue', 'svelte'].includes(extension)) {
      return <Code className="w-4 h-4 text-orange-500" />;
    }
    if (['txt', 'md', 'rtf', 'doc', 'docx', 'pdf', 'odt'].includes(extension)) {
      return <FileText className="w-4 h-4 text-gray-600" />;
    }
    if (['xls', 'xlsx', 'csv', 'ods', 'tsv'].includes(extension)) {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
      return <Archive className="w-4 h-4 text-yellow-600" />;
    }
    
    return <FileIcon className="w-4 h-4 text-gray-400" />;
  };

  const getFileCategory = (extension: string): string => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(extension)) return 'Images';
    if (['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a'].includes(extension)) return 'Audio';
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) return 'Video';
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'vue', 'svelte'].includes(extension)) return 'Code';
    if (['txt', 'md', 'rtf', 'doc', 'docx', 'pdf', 'odt'].includes(extension)) return 'Documents';
    if (['xls', 'xlsx', 'csv', 'ods', 'tsv'].includes(extension)) return 'Spreadsheets';
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) return 'Archives';
    return 'Other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileInfos: FileInfo[] = Array.from(files).map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'no-extension';
      const category = getFileCategory(extension);
      
      return {
        file,
        name: file.name,
        size: file.size,
        lastModified: new Date(file.lastModified),
        type: file.type || 'unknown',
        extension,
        category
      };
    });

    setSelectedFiles(fileInfos);
    setGroupedFiles({});

    toast({
      title: "Files loaded",
      description: `Selected ${fileInfos.length} files for organization`,
    });
  };

  const organizeFiles = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to organize",
        variant: "destructive",
      });
      return;
    }

    setIsOrganizing(true);

    setTimeout(() => {
      let grouped: GroupedFiles = {};

      switch (organizeBy) {
        case 'type':
          selectedFiles.forEach(fileInfo => {
            const group = fileInfo.category;
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(fileInfo);
          });
          break;

        case 'name':
          const alphabetGroups = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
          alphabetGroups.forEach(letter => {
            const filesInGroup = selectedFiles.filter(f => 
              f.name.toUpperCase().startsWith(letter)
            ).sort((a, b) => a.name.localeCompare(b.name));
            if (filesInGroup.length > 0) {
              grouped[`${letter}`] = filesInGroup;
            }
          });
          
          // Files starting with numbers or special characters
          const otherFiles = selectedFiles.filter(f => 
            !/^[A-Za-z]/.test(f.name)
          ).sort((a, b) => a.name.localeCompare(b.name));
          if (otherFiles.length > 0) {
            grouped['0-9 & Symbols'] = otherFiles;
          }
          break;

        case 'date':
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          const oneWeek = 7 * oneDay;
          const oneMonth = 30 * oneDay;

          selectedFiles.forEach(fileInfo => {
            const timeDiff = now - fileInfo.lastModified.getTime();
            let group: string;

            if (timeDiff < oneDay) {
              group = 'Today';
            } else if (timeDiff < oneWeek) {
              group = 'This Week';
            } else if (timeDiff < oneMonth) {
              group = 'This Month';
            } else if (timeDiff < oneMonth * 6) {
              group = 'Last 6 Months';
            } else {
              group = 'Older';
            }

            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(fileInfo);
          });

          // Sort each group by date (newest first)
          Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
          });
          break;

        case 'size':
          selectedFiles.forEach(fileInfo => {
            const sizeInMB = fileInfo.size / (1024 * 1024);
            let group: string;

            if (sizeInMB < 0.1) {
              group = 'Very Small (< 100 KB)';
            } else if (sizeInMB < 1) {
              group = 'Small (100 KB - 1 MB)';
            } else if (sizeInMB < 10) {
              group = 'Medium (1 - 10 MB)';
            } else if (sizeInMB < 100) {
              group = 'Large (10 - 100 MB)';
            } else {
              group = 'Very Large (> 100 MB)';
            }

            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(fileInfo);
          });

          // Sort each group by size (largest first)
          Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => b.size - a.size);
          });
          break;
      }

      setGroupedFiles(grouped);
      setIsOrganizing(false);

      toast({
        title: "Files organized",
        description: `Organized ${selectedFiles.length} files into ${Object.keys(grouped).length} groups`,
      });
    }, 500);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setGroupedFiles({});
    setSearchTerm("");
    setSelectedCategory("all");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadFileList = () => {
    const content = Object.entries(groupedFiles).map(([group, files]) => {
      const header = `\n=== ${group} (${files.length} files) ===\n`;
      const fileList = files.map(f => 
        `${f.name} | ${formatFileSize(f.size)} | ${formatDate(f.lastModified)} | ${f.type || 'Unknown'}`
      ).join('\n');
      return header + fileList;
    }).join('\n');

    const blob = new Blob([`File Organization Report\nGenerated: ${new Date().toLocaleString()}\nTotal Files: ${selectedFiles.length}\nOrganized By: ${organizeBy}\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `file-organization-${organizeBy}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report downloaded",
      description: "File organization report saved as TXT file",
    });
  };

  const filteredGroups = Object.entries(groupedFiles).filter(([group, files]) => {
    if (selectedCategory !== "all") {
      return files.some(f => f.category === selectedCategory);
    }
    if (searchTerm) {
      return group.toLowerCase().includes(searchTerm.toLowerCase()) ||
             files.some(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const categories = Array.from(new Set(selectedFiles.map(f => f.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Offline File Organizer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Organize multiple files by type, name, date, or size. View detailed file information and generate 
          organization reports. All processing happens locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Select Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-organizer-upload"
              />
              <label htmlFor="file-organizer-upload" className="cursor-pointer">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Select multiple files to organize
                </p>
                <p className="text-sm text-gray-500">
                  Choose files from your computer to organize and analyze
                </p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Selected Files:</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {selectedFiles.length} files
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Total size: {formatFileSize(totalSize)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFiles}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  {Object.keys(groupedFiles).length > 0 && (
                    <Button
                      size="sm"
                      onClick={downloadFileList}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organization Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organize By
              </label>
              <Select value={organizeBy} onValueChange={(value: 'type' | 'name' | 'date' | 'size') => setOrganizeBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">File Type</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="date">Date Modified</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Files
              </label>
              <Input
                placeholder="Filter by filename or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button 
              onClick={organizeFiles} 
              disabled={isOrganizing || selectedFiles.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isOrganizing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Organizing...
                </>
              ) : (
                <>
                  <SortAsc className="w-4 h-4 mr-2" />
                  Organize Files
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-900">Total Files</div>
                <div className="text-xl font-bold text-blue-600">{selectedFiles.length}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-900">Total Size</div>
                <div className="text-xl font-bold text-green-600">{formatFileSize(totalSize)}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-purple-900">Categories</div>
                <div className="text-xl font-bold text-purple-600">{categories.length}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="font-semibold text-orange-900">Groups</div>
                <div className="text-xl font-bold text-orange-600">{Object.keys(groupedFiles).length}</div>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="font-semibold text-sm mb-2">File Types</h4>
                <div className="space-y-1">
                  {categories.map(category => {
                    const count = selectedFiles.filter(f => f.category === category).length;
                    return (
                      <div key={category} className="flex justify-between text-xs">
                        <span>{category}</span>
                        <Badge variant="secondary" className="text-xs">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isOrganizing && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Organizing files by {organizeBy}...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(groupedFiles).length > 0 && !isOrganizing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Organized Files ({filteredGroups.length} groups)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {filteredGroups.map(([group, files]) => (
                <div key={group} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {group}
                    </h3>
                    <Badge variant="outline">
                      {files.filter(f => selectedCategory === "all" || f.category === selectedCategory).length} files
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {files
                      .filter(f => selectedCategory === "all" || f.category === selectedCategory)
                      .filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((fileInfo, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded border hover:bg-gray-100">
                        {getFileIcon(fileInfo.extension, fileInfo.category)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate" title={fileInfo.name}>
                            {fileInfo.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatFileSize(fileInfo.size)}</span>
                            <Badge variant="outline" className="text-xs">
                              {fileInfo.extension}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            {formatDate(fileInfo.lastModified)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFiles.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Files Selected</h3>
              <p>Select multiple files to start organizing them by type, name, date, or size.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Offline Processing:</strong> All file organization happens entirely in your browser. 
          Files are analyzed locally without any uploads, ensuring complete privacy and fast processing.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Organization Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">By File Type</h4>
              <p className="text-gray-600 mb-2">Groups files into categories like Images, Documents, Audio, Video, Code, etc.</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Images: JPG, PNG, GIF, SVG</li>
                <li>• Documents: PDF, DOC, TXT, MD</li>
                <li>• Code: JS, HTML, CSS, PY</li>
                <li>• Audio/Video: MP3, MP4, AVI</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-600">By Name</h4>
              <p className="text-gray-600 mb-2">Alphabetically organizes files A-Z with separate group for numbers/symbols.</p>
              <ul className="text-gray-600 space-y-1">
                <li>• A-Z: Files starting with letters</li>
                <li>• 0-9 & Symbols: Numeric/special</li>
                <li>• Sorted within each group</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-purple-600">By Date Modified</h4>
              <p className="text-gray-600 mb-2">Groups files by when they were last modified.</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Today: Modified today</li>
                <li>• This Week: Last 7 days</li>
                <li>• This Month: Last 30 days</li>
                <li>• Older: Beyond 6 months</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-orange-600">By File Size</h4>
              <p className="text-gray-600 mb-2">Categorizes files based on their storage size.</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Very Small: &lt; 100 KB</li>
                <li>• Small: 100 KB - 1 MB</li>
                <li>• Medium: 1 - 10 MB</li>
                <li>• Large: 10 - 100 MB</li>
                <li>• Very Large: &gt; 100 MB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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