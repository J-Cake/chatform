# Chat Platform

This chat app is no ordinary chat app - It's designed to work under the demanding hand of a proxy-controlled intranet spread across an entire country.

The DET enforces schools to use a proxy to restrict internet access to students to ensure online safety, however, this setup prevents students from being able to make use of this vast resource called the internet.
This chat platform is actually a HTTP-based VPN with a chat interface built in so students spread across this vast nation have a means of communicating. It works by squeezing itself into the local network, behind the proxy meaning nothing is sent/retrieved from the outside world.
instead all internet traffic who's destination is outside will be forwarded to a public network where the request can be made without having to worry about the proxy.

Since the chat application itself never leaves the *School Grounds* in other words, never reaches for the outside world, nothing has to pass through the proxy, meaning there's nothing it can do about it. Instead we exploit the intranet-like setup of the DET and allow students who have joined this network to connect to the server.

# Installation

## Prerequisites
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://npmjs.com) (This comes bundled with Node)
- [TypeScript](https://www.typescriptlang.org/) (Install through NPM)
- [Grunt Task Runner](https://gruntjs.com/) (Install through NPM)
- [Yarn](https://yarnpkg.com/) (Optional, Replacement for NPM, Install through NPM (Would recommend))
- [Git](https://git-scm.com/)

To get started, follow the instructions below (this method assumes you have none of the prerequisites installed)

First install NodeJS, additional instructions can be found on their website.
Then Install Git, the order in which you install the two is irrelevant.]

On Windows the installers are almost 99.95% of the time sufficient, if not, consult the docs,
On Linux (generally MacOs will have installers for each too), These packages need to be installed manually:

```
$ sudo <your default package manager> install nodejs git
...
```

During the Git install process you may be asked for administrator or sudo privileges. Please grant this as this will add Git to your Path variable.

Once both have been installed, open a **new** terminal instance and check if both have been installed. 

```
$ node -v
v13.8.0

$ git --version
https://git-scm.com/
```

Next confirm NPM is installed:

```
$ npm -v
6.13.6
```

If not, install it 

```
$ sudo <package manager for your repository> install npm
...
```

For the windows installation, if this does occur, restart the Command Prompt instance and try again, if the failure continues, re-install node with the NPM option checked in the installer

Next install yarn (optional)

```
$ npm i -g yarn
...
```

Confirm yarn installed correctly
1, on Windows, restart your CMD instance and type 

```
C:\Users\SampleUser\> yarn -v
6.13.6
```

On Linux / Mac,

```
$ yarn -v
6.13.6
```

Then install typescript.

If you've installed Yarn:

```
$ yarn global add typescript
```

If you haven't:

```
$ npm i -g typescript
```

Do this by first installing the global Grunt package:

With yarn: 

```
$ yarn global add Grunt-cli
...
```

Without yarn:

```
$ npm i -g grunt-cli
```

Clone the project:

```
$ cd /home/SampleUser/

$ git clone https://github.com/J-Cake/chatform.git
...

$ cd ./chatform
```

Install all dependencies:

with yarn:
```
$ yarn
...
```

without yarn:

```
$ npm install
...
```

Prepare launch:

```
$ tsc
...

$ grunt [task*]

$ node ./dist/server/index.js <Optional Port Number>
Listening on port <Port Number>
```

> \* **Grunt Task:** I would advise to use the task appropriate to your needs, 
    If you're planning on deploying, testing or trying, use the `production` task, if you're contributing, the `development` (the task names must be exactly as mentioned). 

> **Note about port numbers:** If you need it, there is support for environment specified ports, the server will look under the variable `PORT`. 

> It is also worth mentioning that the port number is not required at startup. The server will fall back into `9053`.  

If all went well and you see the final message: `Listening on port <Port Number>`, you've set the project up successfully.

If you open a Web Browser to `http://localhost:<Port Number>`, you should see a login page. Congratulations, you've cloned and initialised the project successfully.