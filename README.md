# images-to-xlsx

[![CI](https://github.com/MasatoMakino/images-to-xlsx/actions/workflows/CI.yml/badge.svg)](https://github.com/MasatoMakino/images-to-xlsx/actions/workflows/CI.yml)

.xlsx image list generator.

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/images-to-xlsx.git
```

### Run

```package.json
"scripts": {
  "list":"images-to-xlsx -i ./images"
},
```

load images in directory `./images` and output `./images.xlsx`

### Options

##### -i --input

image directory.

##### -o --output [optional]

output file path.

default : `./images.xlsx`

##### -h

show help.

## License

images-to-xlsx is [MIT licensed](LICENSE).
