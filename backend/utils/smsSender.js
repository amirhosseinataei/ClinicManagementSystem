const https = require('https');

class SmsSender {
    constructor(bodyId, to, args) {
        this.bodyId = bodyId;
        this.to = to;
        this.args = args;
        this.hostname = 'console.melipayamak.com';
        this.port = 443;
        this.path = '/api/send/shared/cfcad809820a42d59beaac1c7d2519f0';
    }

    send() {
        const data = JSON.stringify({
            'bodyId': this.bodyId,
            'to': this.to,
            'args': this.args
        });

        const options = {
            hostname: this.hostname,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data, 'utf-8')
            }
        };

        const req = https.request(options, res => {
            console.log('statusCode: ' + res.statusCode);

            res.on('data', d => {
                process.stdout.write(d);
            });
        });

        req.on('error', error => {
            console.error(error);
        });

        req.write(data);
        req.end();
    }
}

// خروجی گرفتن از کلاس برای استفاده در فایل‌های دیگر
module.exports = SmsSender;
