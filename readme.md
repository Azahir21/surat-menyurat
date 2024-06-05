pm2 start npm --name "my-app" -- start


npm install
change the 'config.json' and .env

create python venv: 

https://www.linuxcapable.com/how-to-install-python-3-11-on-ubuntu-linux/
> sudo add-apt-repository ppa:deadsnakes/ppa -y

> sudo apt install python3.11

> sudo apt install python3.11-venv

> python3.11 -m venv venv

> source venv/bin/activate

> pip install -r req

> disable teseract cli in script.py

> # pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

mkdir daftar_surat
mkdir template_surat

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo --name nama-file-migrasi.js
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo --seed nama-file-migrasi.js

> npm run api-service

> forever start index.js

> forever list

> tail -f path/.forever/jypW.log

> forever logs

> forever stop 0

for install secret_key:

<!-- secret key -->

> node

> require('crypto').randomBytes(64).toString('hex')

> pip install -r requirements.txt

`python: v3.11`

pytesseract 0.3.10
opencv-python 4.9.0.80
PyMuPDF 1.23.16
PyMuPDFb 1.23.9
