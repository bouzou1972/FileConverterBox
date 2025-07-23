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
