import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, RefreshCw, Copy, Plus, Trash2, FileText, Info, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface Citation {
  id: string;
  type: 'book' | 'journal' | 'website' | 'newspaper' | 'magazine' | 'conference' | 'thesis' | 'report';
  authors: string[];
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  doi?: string;
  accessDate?: string;
  location?: string;
  conference?: string;
  degree?: string;
  institution?: string;
}

interface FormattedText {
  apa: string;
  mla: string;
  chicago: string;
}

export default function AcademicWritingFormatter() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentCitation, setCurrentCitation] = useState<Partial<Citation>>({
    type: 'journal',
    authors: [''],
    title: '',
    year: '',
  });
  const [inTextExample, setInTextExample] = useState('');
  const [bibliographyFormatted, setBibliographyFormatted] = useState<FormattedText>({
    apa: '',
    mla: '',
    chicago: ''
  });
  const { toast } = useToast();

  const citationTypes = [
    { value: 'journal', label: 'Journal Article' },
    { value: 'book', label: 'Book' },
    { value: 'website', label: 'Website' },
    { value: 'newspaper', label: 'Newspaper Article' },
    { value: 'magazine', label: 'Magazine Article' },
    { value: 'conference', label: 'Conference Paper' },
    { value: 'thesis', label: 'Thesis/Dissertation' },
    { value: 'report', label: 'Research Report' }
  ];

  const formatAuthorName = (name: string, format: 'apa' | 'mla' | 'chicago', isFirst: boolean = true): string => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    
    const parts = trimmed.split(' ');
    if (parts.length < 2) return trimmed;
    
    const lastName = parts[parts.length - 1];
    const firstNames = parts.slice(0, -1).join(' ');
    
    if (format === 'apa') {
      const initials = firstNames.split(' ').map(n => n.charAt(0).toUpperCase() + '.').join(' ');
      return `${lastName}, ${initials}`;
    } else if (format === 'mla') {
      if (isFirst) {
        return `${lastName}, ${firstNames}`;
      } else {
        return `${firstNames} ${lastName}`;
      }
    } else { // chicago
      if (isFirst) {
        return `${lastName}, ${firstNames}`;
      } else {
        return `${firstNames} ${lastName}`;
      }
    }
  };

  const formatAuthors = (authors: string[], format: 'apa' | 'mla' | 'chicago'): string => {
    const validAuthors = authors.filter(a => a.trim());
    if (validAuthors.length === 0) return '';
    
    if (validAuthors.length === 1) {
      return formatAuthorName(validAuthors[0], format);
    } else if (validAuthors.length === 2) {
      if (format === 'apa') {
        return `${formatAuthorName(validAuthors[0], format)} & ${formatAuthorName(validAuthors[1], format)}`;
      } else {
        return `${formatAuthorName(validAuthors[0], format, true)}, and ${formatAuthorName(validAuthors[1], format, false)}`;
      }
    } else {
      if (format === 'apa') {
        const formatted = validAuthors.slice(0, -1).map(a => formatAuthorName(a, format));
        return `${formatted.join(', ')}, & ${formatAuthorName(validAuthors[validAuthors.length - 1], format)}`;
      } else {
        const formatted = validAuthors.slice(0, -1).map((a, i) => formatAuthorName(a, format, i === 0));
        return `${formatted.join(', ')}, and ${formatAuthorName(validAuthors[validAuthors.length - 1], format, false)}`;
      }
    }
  };

  const formatCitationAPA = (citation: Citation): string => {
    const authors = formatAuthors(citation.authors, 'apa');
    const year = citation.year ? `(${citation.year})` : '';
    const title = citation.title;

    switch (citation.type) {
      case 'journal':
        const journal = citation.journal ? `*${citation.journal}*` : '';
        const volume = citation.volume ? `*${citation.volume}*` : '';
        const issue = citation.issue ? `(${citation.issue})` : '';
        const pages = citation.pages ? citation.pages : '';
        const doi = citation.doi ? `https://doi.org/${citation.doi}` : '';
        return `${authors} ${year}. ${title}. ${journal}, ${volume}${issue}, ${pages}. ${doi}`.replace(/\s+/g, ' ').trim();

      case 'book':
        const publisher = citation.publisher || '';
        return `${authors} ${year}. *${title}*. ${publisher}.`.replace(/\s+/g, ' ').trim();

      case 'website':
        const url = citation.url || '';
        const accessDate = citation.accessDate ? `Retrieved ${citation.accessDate}, from` : '';
        return `${authors} ${year}. ${title}. ${accessDate} ${url}`.replace(/\s+/g, ' ').trim();

      default:
        return `${authors} ${year}. ${title}.`.replace(/\s+/g, ' ').trim();
    }
  };

  const formatCitationMLA = (citation: Citation): string => {
    const authors = formatAuthors(citation.authors, 'mla');
    const title = `"${citation.title}"`;

    switch (citation.type) {
      case 'journal':
        const mlaJournal = citation.journal ? `*${citation.journal}*` : '';
        const mlaVolume = citation.volume ? `vol. ${citation.volume}` : '';
        const mlaIssue = citation.issue ? `no. ${citation.issue}` : '';
        const mlaYear = citation.year;
        const mlaPages = citation.pages ? `pp. ${citation.pages}` : '';
        return `${authors}. ${title} ${mlaJournal}, ${mlaVolume}, ${mlaIssue}, ${mlaYear}, ${mlaPages}.`.replace(/\s+/g, ' ').trim();

      case 'book':
        const mlaPublisher = citation.publisher || '';
        const mlaBookYear = citation.year;
        return `${authors}. *${citation.title}*. ${mlaPublisher}, ${mlaBookYear}.`.replace(/\s+/g, ' ').trim();

      case 'website':
        const mlaUrl = citation.url || '';
        const mlaAccessDate = citation.accessDate ? `Accessed ${citation.accessDate}` : '';
        return `${authors}. ${title} Web. ${mlaAccessDate}. ${mlaUrl}`.replace(/\s+/g, ' ').trim();

      default:
        return `${authors}. ${title} ${citation.year}.`.replace(/\s+/g, ' ').trim();
    }
  };

  const formatCitationChicago = (citation: Citation): string => {
    const authors = formatAuthors(citation.authors, 'chicago');
    const title = `"${citation.title}"`;

    switch (citation.type) {
      case 'journal':
        const chicagoJournal = citation.journal ? `*${citation.journal}*` : '';
        const chicagoVolume = citation.volume ? `${citation.volume}` : '';
        const chicagoIssue = citation.issue ? `no. ${citation.issue}` : '';
        const chicagoYear = citation.year ? `(${citation.year})` : '';
        const chicagoPages = citation.pages ? citation.pages : '';
        return `${authors}. ${title} ${chicagoJournal} ${chicagoVolume}, ${chicagoIssue} ${chicagoYear}: ${chicagoPages}.`.replace(/\s+/g, ' ').trim();

      case 'book':
        const chicagoLocation = citation.location || '';
        const chicagoPublisher = citation.publisher || '';
        const chicagoBookYear = citation.year;
        return `${authors}. *${citation.title}*. ${chicagoLocation}: ${chicagoPublisher}, ${chicagoBookYear}.`.replace(/\s+/g, ' ').trim();

      case 'website':
        const chicagoUrl = citation.url || '';
        const chicagoAccessDate = citation.accessDate ? `accessed ${citation.accessDate}` : '';
        return `${authors}. ${title} ${chicagoAccessDate}. ${chicagoUrl}.`.replace(/\s+/g, ' ').trim();

      default:
        return `${authors}. ${title} ${citation.year}.`.replace(/\s+/g, ' ').trim();
    }
  };

  const generateInTextCitation = (citation: Citation, format: 'apa' | 'mla' | 'chicago'): string => {
    const firstAuthor = citation.authors[0]?.split(' ').slice(-1)[0] || 'Author';
    const year = citation.year;

    if (format === 'apa') {
      if (citation.authors.length === 1) {
        return `(${firstAuthor}, ${year})`;
      } else if (citation.authors.length === 2) {
        const secondAuthor = citation.authors[1]?.split(' ').slice(-1)[0] || 'Author2';
        return `(${firstAuthor} & ${secondAuthor}, ${year})`;
      } else {
        return `(${firstAuthor} et al., ${year})`;
      }
    } else if (format === 'mla') {
      if (citation.authors.length === 1) {
        return `(${firstAuthor})`;
      } else if (citation.authors.length === 2) {
        const secondAuthor = citation.authors[1]?.split(' ').slice(-1)[0] || 'Author2';
        return `(${firstAuthor} and ${secondAuthor})`;
      } else {
        return `(${firstAuthor} et al.)`;
      }
    } else { // chicago
      return `(${firstAuthor} ${year})`;
    }
  };

  const addAuthor = () => {
    setCurrentCitation(prev => ({
      ...prev,
      authors: [...(prev.authors || ['']), '']
    }));
  };

  const removeAuthor = (index: number) => {
    setCurrentCitation(prev => ({
      ...prev,
      authors: prev.authors?.filter((_, i) => i !== index) || []
    }));
  };

  const updateAuthor = (index: number, value: string) => {
    setCurrentCitation(prev => ({
      ...prev,
      authors: prev.authors?.map((author, i) => i === index ? value : author) || []
    }));
  };

  const addCitation = () => {
    if (!currentCitation.title?.trim() || !currentCitation.authors?.some(a => a.trim())) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and one author",
        variant: "destructive",
      });
      return;
    }

    const newCitation: Citation = {
      id: Date.now().toString(),
      type: currentCitation.type as Citation['type'] || 'journal',
      authors: currentCitation.authors?.filter(a => a.trim()) || [''],
      title: currentCitation.title || '',
      year: currentCitation.year || '',
      publisher: currentCitation.publisher,
      journal: currentCitation.journal,
      volume: currentCitation.volume,
      issue: currentCitation.issue,
      pages: currentCitation.pages,
      url: currentCitation.url,
      doi: currentCitation.doi,
      accessDate: currentCitation.accessDate,
      location: currentCitation.location,
      conference: currentCitation.conference,
      degree: currentCitation.degree,
      institution: currentCitation.institution
    };

    setCitations(prev => [...prev, newCitation]);
    
    // Reset form
    setCurrentCitation({
      type: 'journal',
      authors: [''],
      title: '',
      year: '',
    });

    generateBibliography([...citations, newCitation]);

    toast({
      title: "Citation added",
      description: "Citation has been added to your bibliography",
    });
  };

  const removeCitation = (id: string) => {
    const updatedCitations = citations.filter(c => c.id !== id);
    setCitations(updatedCitations);
    generateBibliography(updatedCitations);
  };

  const generateBibliography = (citationList: Citation[] = citations) => {
    if (citationList.length === 0) {
      setBibliographyFormatted({ apa: '', mla: '', chicago: '' });
      return;
    }

    // Sort citations alphabetically by first author's last name
    const sortedCitations = [...citationList].sort((a, b) => {
      const aAuthor = a.authors[0]?.split(' ').slice(-1)[0] || '';
      const bAuthor = b.authors[0]?.split(' ').slice(-1)[0] || '';
      return aAuthor.localeCompare(bAuthor);
    });

    const apa = sortedCitations.map(c => formatCitationAPA(c)).join('\n\n');
    const mla = sortedCitations.map(c => formatCitationMLA(c)).join('\n\n');
    const chicago = sortedCitations.map(c => formatCitationChicago(c)).join('\n\n');

    setBibliographyFormatted({ apa, mla, chicago });
  };

  const loadSample = () => {
    const sampleCitations: Citation[] = [
      {
        id: '1',
        type: 'journal',
        authors: ['John Smith', 'Jane Doe'],
        title: 'The Impact of Climate Change on Agricultural Productivity',
        year: '2023',
        journal: 'Environmental Science Quarterly',
        volume: '45',
        issue: '3',
        pages: '123-145',
        doi: '10.1234/esq.2023.45.3.123'
      },
      {
        id: '2',
        type: 'book',
        authors: ['Sarah Johnson'],
        title: 'Modern Research Methods in Social Sciences',
        year: '2022',
        publisher: 'Academic Press',
        location: 'New York'
      },
      {
        id: '3',
        type: 'website',
        authors: ['World Health Organization'],
        title: 'Global Health Statistics 2023',
        year: '2023',
        url: 'https://www.who.int/data/global-health-statistics',
        accessDate: 'March 15, 2024'
      }
    ];

    setCitations(sampleCitations);
    generateBibliography(sampleCitations);

    toast({
      title: "Sample loaded",
      description: "Sample citations have been loaded for demonstration",
    });
  };

  const clearAll = () => {
    setCitations([]);
    setBibliographyFormatted({ apa: '', mla: '', chicago: '' });
    setCurrentCitation({
      type: 'journal',
      authors: [''],
      title: '',
      year: '',
    });
  };

  const getFieldsForType = (type: string) => {
    switch (type) {
      case 'journal':
        return ['journal', 'volume', 'issue', 'pages', 'doi'];
      case 'book':
        return ['publisher', 'location'];
      case 'website':
        return ['url', 'accessDate'];
      case 'newspaper':
      case 'magazine':
        return ['publisher', 'pages'];
      case 'conference':
        return ['conference', 'location', 'pages'];
      case 'thesis':
        return ['degree', 'institution', 'location'];
      case 'report':
        return ['publisher', 'location'];
      default:
        return [];
    }
  };

  const renderCitationForm = () => {
    const fields = getFieldsForType(currentCitation.type || 'journal');

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="citation-type">Citation Type</Label>
          <Select 
            value={currentCitation.type || 'journal'} 
            onValueChange={(value) => setCurrentCitation(prev => ({ ...prev, type: value as Citation['type'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {citationTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Authors</Label>
          {currentCitation.authors?.map((author, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                placeholder="First Last"
                value={author}
                onChange={(e) => updateAuthor(index, e.target.value)}
                className="flex-1"
              />
              {currentCitation.authors!.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAuthor(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addAuthor}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Author
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={currentCitation.title || ''}
              onChange={(e) => setCurrentCitation(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              placeholder="2024"
              value={currentCitation.year || ''}
              onChange={(e) => setCurrentCitation(prev => ({ ...prev, year: e.target.value }))}
            />
          </div>
        </div>

        {fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </Label>
                <Input
                  id={field}
                  placeholder={`Enter ${field}`}
                  value={(currentCitation as any)[field] || ''}
                  onChange={(e) => setCurrentCitation(prev => ({ ...prev, [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        )}

        <Button onClick={addCitation} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Citation
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Academic Writing Formatter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate properly formatted citations and bibliographies in APA, MLA, and Chicago styles. 
          Add sources and get instant formatting with in-text citation examples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Add Citation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
              
              {renderCitationForm()}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Citation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Total Citations</div>
                  <div className="text-2xl font-bold text-blue-600">{citations.length}</div>
                </div>
                
                {citations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Citation Types</h4>
                    {Object.entries(
                      citations.reduce((acc, c) => {
                        acc[c.type] = (acc[c.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {citations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Citations ({citations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {citations.map((citation) => (
                <div key={citation.id} className="flex items-start justify-between gap-4 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {citation.type}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {citation.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {citation.authors.join(', ')} ({citation.year})
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>APA: {generateInTextCitation(citation, 'apa')}</span>
                      <span>MLA: {generateInTextCitation(citation, 'mla')}</span>
                      <span>Chicago: {generateInTextCitation(citation, 'chicago')}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCitation(citation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {citations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Bibliography & References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="apa" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="apa">APA Style</TabsTrigger>
                <TabsTrigger value="mla">MLA Style</TabsTrigger>
                <TabsTrigger value="chicago">Chicago Style</TabsTrigger>
              </TabsList>
              
              <TabsContent value="apa" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">References</h3>
                    <CopyButton text={bibliographyFormatted.apa} label="Copy APA" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-serif leading-relaxed">
                      {bibliographyFormatted.apa || 'No citations added yet'}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mla" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Works Cited</h3>
                    <CopyButton text={bibliographyFormatted.mla} label="Copy MLA" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-serif leading-relaxed">
                      {bibliographyFormatted.mla || 'No citations added yet'}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chicago" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Bibliography</h3>
                    <CopyButton text={bibliographyFormatted.chicago} label="Copy Chicago" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-serif leading-relaxed">
                      {bibliographyFormatted.chicago || 'No citations added yet'}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Simplified Formatting:</strong> This tool provides basic citation formatting following general style guidelines. 
          For complex sources or specific institutional requirements, always consult the official style manuals or your institution's guidelines.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Citation Style Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">APA Style</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Used in psychology, education, sciences</li>
                <li>• Author-date format: (Smith, 2023)</li>
                <li>• "References" section</li>
                <li>• DOI required when available</li>
                <li>• Hanging indent for references</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-600">MLA Style</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Used in literature, humanities</li>
                <li>• Author-page format: (Smith 123)</li>
                <li>• "Works Cited" section</li>
                <li>• Medium of publication noted</li>
                <li>• Hanging indent for citations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-600">Chicago Style</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Used in history, art, literature</li>
                <li>• Footnotes/endnotes or author-date</li>
                <li>• "Bibliography" section</li>
                <li>• Detailed publication information</li>
                <li>• Hanging indent for bibliography</li>
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
          All formatting happens in your browser - your citations never leave your device!
        </p>
      </div>
    </div>
  );
}