import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import CsvConverter from "@/pages/csv-converter";
import RegexTester from "@/pages/regex-tester";
import TimestampConverter from "@/pages/timestamp-converter";
import UuidGenerator from "@/pages/uuid-generator";
import JsonFormatter from "@/pages/json-formatter";
import LoremGenerator from "@/pages/lorem-generator";
import MarkdownConverter from "@/pages/markdown-converter";
import PDFConverter from "@/pages/pdf-converter";
import PngToPdf from "@/pages/png-to-pdf";
import PdfToPpt from "@/pages/pdf-to-ppt";
import Base64Converter from "@/pages/base64-converter";
import TextCaseConverter from "@/pages/text-case-converter";
import TextDiffChecker from "@/pages/text-diff-checker";
import HtmlToMarkdown from "@/pages/html-to-markdown";
import JsonXmlConverter from "@/pages/json-xml-converter";
import HtmlMinifier from "@/pages/html-minifier";
import NumberBaseConverter from "@/pages/number-base-converter";
import HashGenerator from "@/pages/hash-generator";
import TextLineTools from "@/pages/text-line-tools";
import ImageToBase64 from "@/pages/image-to-base64";
import ColorConverter from "@/pages/color-converter";
import CsvMerger from "@/pages/csv-merger";
import TextAnalyzer from "@/pages/text-analyzer";
import ImageConverter from "@/pages/image-converter";
import ImageResizer from "@/pages/image-resizer";
import WhitespaceTool from "@/pages/whitespace-tool";
import CsvViewer from "@/pages/csv-viewer";
import TextEncryptor from "@/pages/text-encryptor";
import ColorPaletteGenerator from "@/pages/color-palette-generator";
import StringToJson from "@/pages/string-to-json";
import ExcelConverter from "@/pages/excel-converter";
import DataCleaner from "@/pages/data-cleaner";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/csv-converter" component={CsvConverter} />
        <Route path="/regex-tester" component={RegexTester} />
        <Route path="/timestamp-converter" component={TimestampConverter} />
        <Route path="/uuid-generator" component={UuidGenerator} />
        <Route path="/json-formatter" component={JsonFormatter} />
        <Route path="/lorem-generator" component={LoremGenerator} />
        <Route path="/markdown-converter" component={MarkdownConverter} />
        <Route path="/pdf-converter" component={PDFConverter} />
        <Route path="/png-to-pdf" component={PngToPdf} />
        <Route path="/pdf-to-ppt" component={PdfToPpt} />
        <Route path="/base64-converter" component={Base64Converter} />
        <Route path="/text-case-converter" component={TextCaseConverter} />
        <Route path="/text-diff-checker" component={TextDiffChecker} />
        <Route path="/html-to-markdown" component={HtmlToMarkdown} />
        <Route path="/json-xml-converter" component={JsonXmlConverter} />
        <Route path="/html-minifier" component={HtmlMinifier} />
        <Route path="/number-base-converter" component={NumberBaseConverter} />
        <Route path="/hash-generator" component={HashGenerator} />
        <Route path="/text-line-tools" component={TextLineTools} />
        <Route path="/image-to-base64" component={ImageToBase64} />
        <Route path="/color-converter" component={ColorConverter} />
        <Route path="/csv-merger" component={CsvMerger} />
        <Route path="/text-analyzer" component={TextAnalyzer} />
        <Route path="/image-converter" component={ImageConverter} />
        <Route path="/image-resizer" component={ImageResizer} />
        <Route path="/whitespace-tool" component={WhitespaceTool} />
        <Route path="/csv-viewer" component={CsvViewer} />
        <Route path="/text-encryptor" component={TextEncryptor} />
        <Route path="/color-palette-generator" component={ColorPaletteGenerator} />
        <Route path="/string-to-json" component={StringToJson} />
        <Route path="/excel-converter" component={ExcelConverter} />
        <Route path="/data-cleaner" component={DataCleaner} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
