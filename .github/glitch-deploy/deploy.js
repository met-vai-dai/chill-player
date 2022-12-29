const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/swift-cream-diver|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/hyper-curly-shirt|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/battle-bow-booklet|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/delicious-uncovered-shroud|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/nebula-pouncing-trick|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/obvious-ivy-toaster|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/exciting-hyper-sneezeweed|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/battle-tarry-tuba|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/discreet-witty-nest|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/scintillating-solar-lunaria|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/curse-acoustic-emu|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/confusion-psychedelic-gondola|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/mountainous-smart-cylinder|https://cbf93c1e-11b5-42e1-9c02-e7ea684a5af9@api.glitch.com/git/tricky-colorful-coelurus`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();