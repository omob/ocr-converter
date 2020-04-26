# OCR Converter

Ocr converter is an application that helps convert pdf to text/word document

### Requirement

1. Install [Poppler](http://blog.alivate.com.au/poppler-windows/) on your target machine.
   It's an open source set of libraries and command line tools, very useful for dealing with PDF files. We used the `pdftocairo` utility to export pdf to images
2. Install [Tessaract](https://github.com/UB-Mannheim/tesseract/wiki) OCR Engine

### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd ocr-converter
$ npm install
$ node index.js
```

### To run using command line args

```sh
$ node index.js [command] --filepath [filepath] --destination [destionationpath]
```

### Development

Want to contribute? Great!

Clone the repo!

## License

MIT

**Free Software!**
