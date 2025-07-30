import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
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
import CharacterCounter from "@/pages/character-counter";
import ClipboardInspector from "@/pages/clipboard-inspector";
import Calculator from "@/pages/calculator";
import TextCompressor from "@/pages/text-compressor";
import GrammarChecker from "@/pages/grammar-checker";
import FaviconGenerator from "@/pages/favicon-generator";
import SocialMediaCropper from "@/pages/social-media-cropper";
import LogoCleaner from "@/pages/logo-cleaner";
import ReadabilityGrader from "@/pages/readability-grader";
import PassiveVoiceDetector from "@/pages/passive-voice-detector";
import AcademicWritingFormatter from "@/pages/academic-writing-formatter";
import ZipViewer from "@/pages/zip-viewer";
import FileOrganizer from "@/pages/file-organizer";
import FileSplitter from "@/pages/file-splitter";
import QRGenerator from "@/pages/qr-generator";
import PasswordGenerator from "@/pages/password-generator";
import BarcodeGenerator from "@/pages/barcode-generator";
import ImageOptimizer from "@/pages/image-optimizer";
import ColorPaletteExtractor from "@/pages/color-palette-extractor";
import SEOOptimizer from "@/pages/seo-optimizer";
import SEOToolsSuite from "@/pages/seo-tools-suite";
import DNSChecker from "@/pages/dns-checker";
import HVACBTUCalculator from "@/pages/hvac-btu-calculator";
import VoltageDropCalculator from "@/pages/voltage-drop-calculator";
import SuperheatCalculator from "@/pages/superheat-calculator";
import DuctSizeCalculator from "@/pages/duct-size-calculator";
import OhmsLawCalculator from "@/pages/ohms-law-calculator";
import WireSizeCalculator from "@/pages/wire-size-calculator";
import StaticPressureCalculator from "@/pages/static-pressure-calculator";
import WattageCalculator from "@/pages/wattage-calculator";
import PipeVolumeCalculator from "@/pages/pipe-volume-calculator";
import JobTimer from "@/pages/job-timer";
import AreaVolumeCalculator from "@/pages/area-volume-calculator";
import RefrigerantChargeCalculator from "@/pages/refrigerant-charge-calculator";
import UnitConverter from "@/pages/unit-converter";
import ScientificCalculator from "@/pages/scientific-calculator";
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
        <Route path="/character-counter" component={CharacterCounter} />
        <Route path="/clipboard-inspector" component={ClipboardInspector} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/text-compressor" component={TextCompressor} />
        <Route path="/unit-converter" component={UnitConverter} />
        <Route path="/grammar-checker" component={GrammarChecker} />
        <Route path="/favicon-generator" component={FaviconGenerator} />
        <Route path="/social-media-cropper" component={SocialMediaCropper} />
        <Route path="/logo-cleaner" component={LogoCleaner} />
        <Route path="/readability-grader" component={ReadabilityGrader} />
        <Route path="/passive-voice-detector" component={PassiveVoiceDetector} />
        <Route path="/academic-writing-formatter" component={AcademicWritingFormatter} />
        <Route path="/zip-viewer" component={ZipViewer} />
        <Route path="/file-organizer" component={FileOrganizer} />
        <Route path="/file-splitter" component={FileSplitter} />
        <Route path="/qr-generator" component={QRGenerator} />
        <Route path="/password-generator" component={PasswordGenerator} />
        <Route path="/barcode-generator" component={BarcodeGenerator} />
        <Route path="/image-optimizer" component={ImageOptimizer} />
        <Route path="/color-palette-extractor" component={ColorPaletteExtractor} />
        <Route path="/seo-optimizer" component={SEOOptimizer} />
        <Route path="/seo-tools-suite" component={SEOToolsSuite} />
        <Route path="/dns-checker" component={DNSChecker} />
        <Route path="/hvac-btu-calculator" component={HVACBTUCalculator} />
        <Route path="/voltage-drop-calculator" component={VoltageDropCalculator} />
        <Route path="/superheat-calculator" component={SuperheatCalculator} />
        <Route path="/duct-size-calculator" component={DuctSizeCalculator} />
        <Route path="/ohms-law-calculator" component={OhmsLawCalculator} />
        <Route path="/wire-size-calculator" component={WireSizeCalculator} />
        <Route path="/static-pressure-calculator" component={StaticPressureCalculator} />
        <Route path="/wattage-calculator" component={WattageCalculator} />
        <Route path="/pipe-volume-calculator" component={PipeVolumeCalculator} />
        <Route path="/job-timer" component={JobTimer} />
        <Route path="/area-volume-calculator" component={AreaVolumeCalculator} />
        <Route path="/refrigerant-charge-calculator" component={RefrigerantChargeCalculator} />
        <Route path="/unit-converter" component={UnitConverter} />
        <Route path="/scientific-calculator" component={ScientificCalculator} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Router />
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
