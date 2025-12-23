function extractTax(text: string) {
    const clean = text.replace(/\s+/g, "").normalize("NFC");
  
    const match = clean.match(/(\d-\d{4}-\d{5}-\d{2}-\d)/);
  
    if (!match) return null;
  
    const dashed = match[1];
    const normalized = dashed.replace(/-/g, "");
  
    return normalized;
  }
