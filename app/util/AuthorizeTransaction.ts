const { SHA3 } = require("sha3");
var EC = require("elliptic").ec;
var ec = new EC("p256");

class AuthorizeTransaction {

  signTransaction = (message: string) => {
    const key = ec.keyFromPrivate(Buffer.from(process.env.PRIVATE_KEY, "hex"));
    const sig = key.sign(this.hash(message)); 
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
  };

  hash = (message: string) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest();
  };
}

export default new AuthorizeTransaction();
