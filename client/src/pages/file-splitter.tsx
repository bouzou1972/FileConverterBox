import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  Scissors, 
  Combine,
  FileIcon,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle,
  File,
  HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface FileChunk {
  blob: Blob;
  filename: string;
  index: number;
  size: number;
  url: string;
}

export default function FileSplitter() {
  // Split functionality state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState<number>(5);
  const [chunks, setChunks] = useState<FileChunk[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  
  // Join functionality state
  const [joinFiles, setJoinFiles] = useState<File[]>([]);
  const [joinedFile, setJoinedFile] = useState<{ blob: Blob; filename: string; url: string } | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  
  const splitFileInputRef = useRef<HTMLInputElement>(null);
  const joinFilesInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSplit = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to split",
        variant: "destructive",
      });
      return;
    }

    if (chunkSize < 1 || chunkSize > 1000) {
      toast({
        title: "Invalid chunk size",
        description: "Chunk size must be between 1 and 1000 MB",
        variant: "destructive",
      });
      return;
    }

    setIsSplitting(true);
    setChunks([]);

    try {
      const chunkSizeBytes = chunkSize * 1024 * 1024;
      const totalChunks = Math.ceil(selectedFile.size / chunkSizeBytes);
      const newChunks: FileChunk[] = [];

      // Clean up previous URLs
      chunks.forEach(chunk => URL.revokeObjectURL(chunk.url));

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSizeBytes;
        const end = Math.min(selectedFile.size, start + chunkSizeBytes);
        const blob = selectedFile.slice(start, end);
        const url = URL.createObjectURL(blob);
        
        const chunk: FileChunk = {
          blob,
          filename: `${selectedFile.name}.part${String(i + 1).padStart(3, '0')}`,
          index: i + 1,
          size: blob.size,
          url
        };
        
        newChunks.push(chunk);
      }

      setChunks(newChunks);
      setIsSplitting(false);

      toast({
        title: "File split successfully",
        description: `Created ${totalChunks} chunks from ${formatFileSize(selectedFile.size)} file`,
      });

    } catch (error) {
      setIsSplitting(false);
      toast({
        title: "Split failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileJoin = async () => {
    if (joinFiles.length < 2) {
      toast({
        title: "Insufficient files",
        description: "Please select at least 2 chunk files to join",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    setJoinedFile(null);

    try {
      // Sort files by name to ensure correct order
      const sortedFiles = [...joinFiles].sort((a, b) => a.name.localeCompare(b.name));

      // Read all files as ArrayBuffer
      const buffers = await Promise.all(
        sortedFiles.map(file => file.arrayBuffer())
      );

      // Calculate total size
      const totalSize = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);

      // Create joined file
      const joinedArray = new Uint8Array(totalSize);
      let offset = 0;

      for (const buffer of buffers) {
        joinedArray.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      }

      const joinedBlob = new Blob([joinedArray]);
      
      // Clean up previous URL
      if (joinedFile) {
        URL.revokeObjectURL(joinedFile.url);
      }

      // Determine original filename (remove .part### extension)
      const originalName = sortedFiles[0].name.replace(/\.part\d+$/, '') || 'joined_file';
      const url = URL.createObjectURL(joinedBlob);

      setJoinedFile({
        blob: joinedBlob,
        filename: originalName,
        url
      });

      setIsJoining(false);

      toast({
        title: "Files joined successfully",
        description: `Created ${formatFileSize(joinedBlob.size)} file from ${sortedFiles.length} chunks`,
      });

    } catch (error) {
      setIsJoining(false);
      toast({
        title: "Join failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const downloadChunk = (chunk: FileChunk) => {
    const link = document.createElement('a');
    link.href = chunk.url;
    link.download = chunk.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: `Downloading ${chunk.filename}`,
    });
  };

  const downloadAllChunks = () => {
    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        downloadChunk(chunk);
      }, index * 100); // Small delay between downloads
    });

    toast({
      title: "Downloads started",
      description: `Downloading all ${chunks.length} chunks`,
    });
  };

  const downloadJoinedFile = () => {
    if (!joinedFile) return;

    const link = document.createElement('a');
    link.href = joinedFile.url;
    link.download = joinedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: `Downloading ${joinedFile.filename}`,
    });
  };

  const handleSplitFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5GB for performance)
    if (file.size > 5 * 1024 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5GB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setChunks([]);
  };

  const handleJoinFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setJoinFiles(fileArray);
    setJoinedFile(null);
  };

  const clearSplitData = () => {
    setSelectedFile(null);
    chunks.forEach(chunk => URL.revokeObjectURL(chunk.url));
    setChunks([]);
    if (splitFileInputRef.current) {
      splitFileInputRef.current.value = "";
    }
  };

  const clearJoinData = () => {
    setJoinFiles([]);
    if (joinedFile) {
      URL.revokeObjectURL(joinedFile.url);
      setJoinedFile(null);
    }
    if (joinFilesInputRef.current) {
      joinFilesInputRef.current.value = "";
    }
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      chunks.forEach(chunk => URL.revokeObjectURL(chunk.url));
      if (joinedFile) {
        URL.revokeObjectURL(joinedFile.url);
      }
    };
  }, [chunks, joinedFile]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Large File Splitter & Joiner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Split large files into smaller chunks for easier sharing or storage, then rejoin them back to the original file. 
          All processing happens locally in your browser for complete privacy.
        </p>
      </div>

      <Tabs defaultValue="split" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="split" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Split File
          </TabsTrigger>
          <TabsTrigger value="join" className="flex items-center gap-2">
            <Combine className="w-4 h-4" />
            Join Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="split" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Select File to Split
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={splitFileInputRef}
                    type="file"
                    onChange={handleSplitFileSelect}
                    className="hidden"
                    id="split-file-upload"
                  />
                  <label htmlFor="split-file-upload" className="cursor-pointer">
                    <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Select large file to split
                    </p>
                    <p className="text-sm text-gray-500">
                      Maximum file size: 5GB
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
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="chunk-size">Chunk Size (MB)</Label>
                        <Input
                          id="chunk-size"
                          type="number"
                          min="1"
                          max="1000"
                          value={chunkSize}
                          onChange={(e) => setChunkSize(parseInt(e.target.value) || 5)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Will create ~{Math.ceil(selectedFile.size / (chunkSize * 1024 * 1024))} chunks
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleFileSplit}
                          disabled={isSplitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSplitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Splitting...
                            </>
                          ) : (
                            <>
                              <Scissors className="w-4 h-4 mr-2" />
                              Split File
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearSplitData}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  File Chunks
                  {chunks.length > 0 && (
                    <Badge variant="outline">{chunks.length} chunks</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chunks.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Split into {chunks.length} chunks
                      </p>
                      <Button
                        size="sm"
                        onClick={downloadAllChunks}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {chunks.map((chunk) => (
                        <div key={chunk.index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <File className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">{chunk.filename}</p>
                              <p className="text-xs text-gray-500">
                                Chunk {chunk.index} • {formatFileSize(chunk.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadChunk(chunk)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Scissors className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chunks created yet</p>
                    <p className="text-sm mt-2">Select a file and click "Split File" to create chunks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="join" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Select Chunk Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={joinFilesInputRef}
                    type="file"
                    multiple
                    onChange={handleJoinFilesSelect}
                    className="hidden"
                    id="join-files-upload"
                  />
                  <label htmlFor="join-files-upload" className="cursor-pointer">
                    <Combine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Select chunk files to join
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose multiple .part files created by file splitter
                    </p>
                  </label>
                </div>

                {joinFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Selected Chunks:</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {joinFiles.length} files selected
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Total size: {formatFileSize(joinFiles.reduce((sum, file) => sum + file.size, 0))}
                    </p>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                      {joinFiles
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleFileJoin}
                        disabled={isJoining || joinFiles.length < 2}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isJoining ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <Combine className="w-4 h-4 mr-2" />
                            Join Files
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearJoinData}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Joined File
                </CardTitle>
              </CardHeader>
              <CardContent>
                {joinedFile ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">File Joined Successfully</h4>
                      </div>
                      <p className="text-green-700 text-sm mb-1">{joinedFile.filename}</p>
                      <p className="text-green-600 text-sm">
                        Size: {formatFileSize(joinedFile.blob.size)}
                      </p>
                    </div>
                    
                    <Button
                      onClick={downloadJoinedFile}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Joined File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Combine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No joined file ready</p>
                    <p className="text-sm mt-2">Select chunk files and click "Join Files" to combine them</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> All file splitting and joining happens entirely in your browser. 
          Files are never uploaded to any server, ensuring complete privacy and security of your data.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-blue-600 flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                File Splitting
              </h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Choose any large file (up to 5GB)</li>
                <li>• Set chunk size (1-1000 MB)</li>
                <li>• File is split into numbered parts (.part001, .part002, etc.)</li>
                <li>• Download individual chunks or all at once</li>
                <li>• Perfect for sharing large files via email or cloud storage</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                <Combine className="w-4 h-4" />
                File Joining
              </h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Select all chunk files (.part001, .part002, etc.)</li>
                <li>• Files are automatically sorted by name</li>
                <li>• Chunks are joined back to original file</li>
                <li>• Download the reconstructed file</li>
                <li>• Maintains original file integrity and quality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Email Attachments</h4>
              <p className="text-blue-700">Split large files to bypass email size limits (usually 25MB)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Cloud Storage</h4>
              <p className="text-green-700">Upload large files to cloud services with size restrictions</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Network Transfer</h4>
              <p className="text-purple-700">Transfer large files over slow or unreliable connections</p>
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