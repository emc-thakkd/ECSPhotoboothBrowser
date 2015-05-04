PhotoboothBrowser
======================
Photobooth is exactly what you think it is, it's an application to run a photobooth! This application was/is/will be used at EMC World 2015 in the EMC {code} booth.Photobooth Browser demonstrates that the photobooth app is powered via an ECS array and the ease of use with which platform3 applications can be coded against it. 

## Description
The photobooth uses the following technologies:
- Node.js
- Express.js w/ Mustache Templating (Async/FS)
- S3 (ECS via AWS-SDK) 

The PhotoboothBrowser connects to the photobooth bucket on ECS and randomly selects photobooth users images to display on the page. It also computes the total # of users and the average size of the objects that are stored in the photobooth bucket on the ECS appliance. 

## Installation
There are a few methods to running this photobooth. You can run it locally on your laptop for development purposes, you can run it on a server, or run it on a PaaS of your choice. The `manifest.yml` is included for Cloud Foundry deployments

1. For Local Desktop or Server configurations
    1. Copy this repo
    3. create a new file called ~/.aws/credentials` and store the following credentails [default]
aws_access_key_id = something...
aws_secret_access_key = something... 
    4. npm install package.json
    5. npm install aws-sdk
    6. npm install mustache
    7. Start the application with nodejs PhotoBoothStats.js
    8. For the PhotoBoothBrowser app, navigate to `http://127.0.0.1:3000` (substitute 127 for your IP/DNS)
    
## Contribution
Create a fork of the project into your own reposity. Make all your necessary changes and create a pull request with a description on what was added or removed and details explaining the changes in lines of code. If approved, project owners will merge it.

Licensing
---------
Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Support
-------
Please file bugs and issues at the Github issues page. For more general discussions you can contact the EMC Code team at <a href="https://groups.google.com/forum/#!forum/emccode-users">Google Groups</a> or tagged with **EMC** on <a href="https://stackoverflow.com">Stackoverflow.com</a>. The code and documentation are released with no warranties or SLAs and are intended to be supported through a community driven process.# ECSPhotoboothBrowser
