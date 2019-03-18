const Ads = require("../../models/ads.js");
const steem = require("steem");

exports.getAds = async function() {
  	return await Ads.find({date:{$gte:new Date(Date.now()-7*24*3600*1000)}});
}

exports.create = async function(ad) {
  const postURI=ad.memo.split(" ")[1];
  const permlink=postURI.split("/")[postURI.split("/").length-1];
  const author=(postURI.split("@")[1]).split("/")[0];
  steem.api.getContent(author, permlink, async function(err, result) {
    const rex=/((http(s?):)([/|.|\w|\-|%|(|)])*\.(?:jpg|png|jpeg|JPG|JPEG|PNG))|((http(s?):)(.)*\/ipfs\/\w*)/;
    const imgPost=rex.exec(result.body);
    const image=imgPost ? imgPost[0] : "no_img";
    const ads=new Ads({
      permlink:permlink,
      author:author,
      postCreation:result.created,
      image:image,
      date: ad.timestamp
    });
    await ads.save();
    console.log("Created ad for "+permlink+" of "+author);
  });
}