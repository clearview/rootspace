# <img width="25" src="https://github.com/clearview/rootspace/blob/main/web/src/assets/logo.png?raw=true" /> Rootspace app

Rootspace is an innovative and lightweight work management software that offers important features for projects that require online collaboration and task management.  
<br>
It consists of features such as file-sharing, task boards, document editing, and other powerful integrations. Additionally, we have used this platform as a means of encouraging knowledge-sharing and experimentation with emerging technologies among Clearview LLC's team members.  
<br>
One of Rootspace's strongest attributes is its user-friendly design, as well as its ease of deployment and maintenance. The interface is highly intuitive and user-friendly, making it accessible even to the least-experienced team members. It also has the capability to expand its functionality, with new features easily.  
<br>
Rootspace provides a centralized repository for all project information, eliminating the need to search for scattered emails containing URLs, files, access tokens, keys, passwords, and file links, allowing everyone to quickly jump into the project without wasting time searching for information.  

#### To start exploring Rootspace immediately, simply follow the link:  :link: <a href="https://rootspace.app/" target="_blank">https://rootspace.app/</a>


<!-- ABOUT THE PROJECT -->
<h2 id="about-the-project"> :computer: Rootspace runs with</h2>

[![Technologies](https://skillicons.dev/icons?i=nodejs,vue,typescript,postgresql,redis,docker)](https://skillicons.dev)  

## :eye: A quick preview

![Tasks, Collaboration, Embed, File manager](https://github.com/clearview/rootspace/blob/main/assets/rootspace.gif?raw=true)

> Playing with task lists, Collaborating, Linking external sources, uploading files etc.

## :zap: Spin The Rootspace locally

#### Setup `.env`

After you clone the repo, make a quick copy of .env files.

```bash
# navigate to the project's root folder and:
cp .env.example .env && cp api/.env.example api/.env && cp web/.env.example web/.env
````

#### Seed the database

Seed and spin the containers using `docker compose`. This is done only once, on the first run to populate the database.

```bash
# navigate to the project's root folder and:
docker compose -f docker-compose.yml -f docker-compose-seed.yml up api
````

You will see a message like the one below.

````  
...  
root_api  | 👍  Finished Seeding
root_api  | Done in 5.39s.
root_api exited with code 0
````

The API container should populate the database and exit.

#### Start the services

```bash
# navigate to the project's root folder and:
docker compose up
````

> It will take some time to pull all the images, but eventually, you will see the message:  
```
 🚀 Server ready at: http://localhost:3001
```

 #### Open your browser
  > `# Check your ports. By default the app will try to take port 3000` and navigate your browser to:  
  > [http://localhost:3000](http://localhost:3000)  

 #### Login with demo user:  
 > username: rootspace@example.com  <br>  password: rootspace


> If required, edit .env files in `/`, `web/`, `api/` folders.

## :scroll: Google, S3 Amazon, Sendgrid API Keys  

  If you want to use storage, keep in mind that you would need an S3 bucket and an IAM to be set up. Also, if you want to use Google login, you will need to create a 'Google API project' and obtain 'OAuth 2.0 credentials'. The same thing goes for Sendgrid. Set all the keys in `api/.env` accordingly.

| Key      | Description                         | Findout more |
|-------------|------------------------------|-----|
| SENDGRID_API_KEY | Sendgrid email service | [Sendgrid Account Settings](https://docs.sendgrid.com/ui/account-and-settings/api-keys)   |
| S3_ACCESS_KEY | Amazon S3 Access Key  | [AWS Account and Access Keys](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)  |
| S3_SECRET_KEY | Amazon S3 Secret Key  | [AWS Account and Access Keys](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)  |
| GOOGLE_CLIENT_ID  | Google Client ID | [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)  |
| GOOGLE_CLIENT_SECRET  | Google Client Secret | [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)  |

> Other values filled at your discretion, please check the api/.env.example

## :brain: Debug & Test Options  
  
* Set `logging: true` in `api/db/db.ts` to see in console all SQL queries sent to PostgreSQL server  
  
* You can also run `docker-compose up` or `docker-compose up -d` from `tests` directory to bring up ephemeral testing postgres database.  
  
* If you need Mailhog, Dozzle or Arena containers, you can also spin those in addition to previous  

```bash
$ docker compose -f docker-compose.yml -f docker-compose-dev.yml up
```
  
  > Access Arena at (use user/pass from api/.env file) at http://localhost:3001/arena  
  > Access Dozzle to watch container logs in realtime at http://localhost:9999  
  > Access sent emails with Mailhog at http://localhost:8025  

## :card_index_dividers: API docs

You can use [Insomnia](https://insomnia.rest/) and a file `assets/insomnia.json` to check on API. The API container spins at port `3001` by default.

## :scroll: License  
![GitHub](https://img.shields.io/github/license/clearview/rootspace)  

## :man_technologist: Developed at <img width="22" src="https://github.com/clearview/rootspace/blob/main/assets/cv.jpeg?raw=true" /> [Clearview](https://www.clearview.team)  
  
**Team**: Adi Utama, Aditya Purwa, Adnan Puzic, Aid Arslanagic, Arfan Fudyartanto, Jasmin Ihtijarevic, Januar Fonti, Mirza Eka, Mujo Kodro, Nedim Hadzimahmutovic, Taufan Fadhilah Iskandar, Vedran Alajbegovic  
