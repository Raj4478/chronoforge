/**
 * Inline, render-blocking script that sets the theme class before paint to
 * avoid a flash of the wrong theme. Reads the saved choice, else system pref.
 */
export function ThemeScript() {
  const code = `(function(){try{var k='chronoforge.theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark = s? s==='"dark"'||s==='dark' : m;var c=document.documentElement.classList;dark?c.add('dark'):c.remove('dark');document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
