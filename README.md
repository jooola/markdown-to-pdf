# [Markdown to PDF](https://atom.io/packages/markdown-to-pdf)

Atom package that convert markdown to pdf, png or jpeg on the fly.

This package is baseb on the previous [Markdown to PDF package](https://github.com/travs/markdown-to-pdf) maintained by [travs](https://github.com/travs).

## Usage

Just focus the window containing your markdown file and use the `convert` command (`Packages > Markdown to PDF > Convert`).

The output PDF will be styled similar to the markdown on `github.com`, as well as any [user styles](https://flight-manual.atom.io/using-atom/sections/basic-customization/#style-tweaks) you have added.

It will appear in the same directory as the Markdown you are converting, with the same name and a `.pdf` extension.

You can set parameters in the package's settings, such as page and border size.

### Note on styles

Note that user styles will have to be encapsulated in a `.markdown-body` selector to override the default stylesheets, like this:

```less
.markdown-body {
  h1 {
    font-size: 1.3em;
  }
}
```

## Heart it? Hate it?

Feel free to run `apm star 'markdown-to-pdf'` or give some feedback :smile:
