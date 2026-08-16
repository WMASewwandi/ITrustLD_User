const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "span",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

export function containsHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(String(value || ""));
}

export function sanitizeHtml(input) {
  let html = String(input || "");
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag, attrs = "") => {
    const tagName = String(tag).toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) return "";
    if (match.startsWith("</")) return `</${tagName}>`;

    const classMatch = attrs.match(/\sclass\s*=\s*("([^"]*)"|'([^']*)')/i);
    const className = (classMatch?.[2] ?? classMatch?.[3] ?? "").replace(/[^a-zA-Z0-9_\-\s]/g, "");
    const classAttr = className ? ` class="${className}"` : "";
    const selfClosing = tagName === "br" || /\/\s*>$/.test(match);
    return selfClosing ? `<${tagName}${classAttr}>` : `<${tagName}${classAttr}>`;
  });
  return html.trim();
}
