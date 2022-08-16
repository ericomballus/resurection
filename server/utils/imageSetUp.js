const setup = {
  all: {
    path: "./thumbnails/",
    quality: 80,
  },
  versions: [
    {
      prefix: "big_",
      width: 1024,
      height: 768,
    },
    {
      prefix: "medium_",
      width: 320,
      height: 320,
    },
    {
      quality: 100,
      prefix: "small_",
      width: 128,
      height: 64,
    },
  ],
};

module.exports = setup;
