### Create project
- `mkdir <project_name>`
- `cd /path/to/<project_name>`
- Create virtual environment: `python -m venv venv`
- Activate venv: `source venv/bin/activate`
- Install the project dependencies: `pip install -r requirements.txt`

### Installing MariaDB
<https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-18-04>
<https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04-ru>

- Install the package: `sudo apt install mariadb-server`
- Ensure that MariaDB is running with the systemctl start command: `sudo systemctl start mariadb.service`
- Configuring MariaDB: `sudo mysql_secure_installation`

### Adjusting User Authentication and Privileges
- `sudo mysql`
- `GRANT ALL ON *.* TO '<username>'@'localhost' IDENTIFIED BY '<userpassword>' WITH GRANT OPTION;`
- `FLUSH PRIVILEGES;`
- `exit`

### Testing MariaDB: 
- `sudo systemctl status mariadb`
- `sudo mysqladmin version`

### Create database
- `sudo mysql` or `mysql -u <username> -p`
- `CREATE DATABASE <db_name>;`

### Create tables
- `python3 services/createTableBME.py`
- `python3 services/createTableBMEHistory.py`
- etc

### Working with tables from the console
- `USE <db_name>;`

### Connecting with BME280 and using flask and plotly
<https://www.donskytech.com/raspberry-pi-bme280-weather-station-using-python-and-flask/>

### Starting project
- `flask run --host=0.0.0.0`
- Go to http://<raspberrypi_IP_address>:5000



