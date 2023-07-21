import Account from '#lostcity/db/model/Account.js';

export default function (f, opts, next) {
    f.get('/', async (req, res) => {
        return res.view('index');
    });

    f.get('/title', async (req, res) => {
        const playerCount = await Account.query().whereNotNull('world_id').resultSize();

        return res.view('title', {
            playerCount
        });
    });

    next();
}
