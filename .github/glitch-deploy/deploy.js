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


const listProject = `https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/bronzed-pricey-booth|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/massive-horn-observation|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/enshrined-erratic-cloth|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/outgoing-freezing-manager|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/frill-citrine-rudbeckia|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/vagabond-buttoned-technosaurus|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/cypress-brass-oil|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/patch-bubbly-playground|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/sleepy-canyon-candle|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/waiting-copper-bovid|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/habitual-lacy-aftershave|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/harmless-bolder-yamamomo|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/traveling-grandiose-yuzu|https://bd67b921-17e3-4ca6-8c54-fe601efb5d39@api.glitch.com/git/northern-jumpy-llama`.trim().split('|');

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