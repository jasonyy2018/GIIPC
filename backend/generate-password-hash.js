import bcrypt from 'bcrypt';

const password = 'Password123!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nSQL Update:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email IN ('admin@giip.info', 'editor@giip.info', 'user@giip.info');`);
});
