import __dirname from '../utils.js'

export default {
    welcome: {
        subject:"¡Welcome!",
        attachments: [
            {
                filename:'banner.png',
                path:`${__dirname}/public/img/logo.png`,
                cid:"banner"
            }
        ]
    },
    restore: {
        subject:"Restore password",
        attachments: [
            {
                filename:'banner.png',
                path:`${__dirname}/public/img/logo.png`,
                cid:"banner"
            }
        ]
    }
}