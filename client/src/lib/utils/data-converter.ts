export interface ConversionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function parseCSV(csvText: string): ConversionResult {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) {
      return { success: false, error: 'Empty CSV data' };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function parseTSV(tsvText: string): ConversionResult {
  try {
    const lines = tsvText.trim().split('\n');
    if (lines.length === 0) {
      return { success: false, error: 'Empty TSV data' };
    }

    const headers = lines[0].split('\t').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t').map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function parseJSON(jsonText: string): ConversionResult {
  try {
    const data = JSON.parse(jsonText);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function parseYAML(yamlText: string): ConversionResult {
  try {
    // Basic YAML parser - handles simple cases
    const lines = yamlText.trim().split('\n');
    const data: any = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > -1) {
          const key = trimmed.substring(0, colonIndex).trim();
          const value = trimmed.substring(colonIndex + 1).trim();
          data[key] = value;
        }
      }
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function convertToCSV(data: any[]): ConversionResult {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'Data must be a non-empty array' };
    }

    const headers = Object.keys(data[0]);
    const csv = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => `"${row[header] || ''}"`);
      csv.push(values.join(','));
    });
    
    return { success: true, data: csv.join('\n') };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function convertToTSV(data: any[]): ConversionResult {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'Data must be a non-empty array' };
    }

    const headers = Object.keys(data[0]);
    const tsv = [headers.join('\t')];
    
    data.forEach(row => {
      const values = headers.map(header => row[header] || '');
      tsv.push(values.join('\t'));
    });
    
    return { success: true, data: tsv.join('\n') };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function convertToJSON(data: any): ConversionResult {
  try {
    return { success: true, data: JSON.stringify(data, null, 2) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function convertToYAML(data: any): ConversionResult {
  try {
    // Basic YAML converter
    if (Array.isArray(data)) {
      const yaml = data.map((item, index) => {
        const lines = Object.entries(item).map(([key, value]) => `  ${key}: ${value}`);
        return `- \n${lines.join('\n')}`;
      }).join('\n');
      return { success: true, data: yaml };
    } else {
      const yaml = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
      return { success: true, data: yaml };
    }
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function downloadFile(content: string, filename: string, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
