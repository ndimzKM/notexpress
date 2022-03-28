const path = require("path");
const fs = require("fs");

function response(res, publicFolder, globals) {
  res.json = function (data) {
    if (typeof data !== "object")
      throw new Error("You must pass an object to res.json");
    res.setHeader("Content-Type", "application/json");
    data = JSON.stringify(data);
    res.send(data);
  };
  res.send = function (data) {
    res.end(data);
  };
  res.status = function (code) {
    res.statusCode = Number(code);
    return res;
  };
  res.get = function (header) {
    return res.headers[header.toLowerCase()];
  };

  res.cookie = function (...args) {
    let cookieName,
      cookieValue,
      options = {};
    let cookieOptions = "";
    cookieName = args[0];
    cookieValue = args[1];

    if (args.length === 3) {
      options = args[2];
      for (let option of Object.keys(options)) {
        if (option == "expires") {
          cookieOptions += ` Expires=${options[option]};`;
        } else if (option == "sameSite") {
          cookieOptions += ` SameSite=${options[option]};`;
        } else if (option == "secure") {
          cookieOptions += ` Secure;`;
        } else if (options == "maxAge") {
          cookieOptions += ` Max-Age=${options[option]};`;
        } else if (options == "httpOnly") {
          cookieOptions += ` HttpOnly'`;
        }
      }
    }

    res.setHeader(
      "Set-Cookie",
      `${cookieName}=${cookieValue};${cookieOptions}`
    );
  };

  res.render = function (filename, params = { people: ["al", "bl"] }) {
    if (globals.views) {
      let filepath;
      try {
        if (globals["view engine"] == "ejs") {
          filepath = path.join(globals.views, filename + ".ejs");
          const ejs = require("ejs");
          const html = ejs.renderFile(filepath, params, {}, (err, str) => {
            if (err) throw err;
            else {
              res.setHeader("Content-Type", "text/html");
              res.statusCode = 200;
              res.setHeader("Content-Length", str.length);

              res.send(str);
            }
          });
        } else if (globals["view engine"] == "pug") {
          filepath = path.join(globals.views, filename + ".pug");
          const pug = require("pug");
          pug.renderFile(filepath, params, (err, html) => {
            if (err) throw err;
            else {
              res.setHeader("Content-Type", "text/html");
              res.statusCode = 200;
              res.setHeader("Content-Length", html.length);

              res.send(html);
            }
          });
          // render for pug
        } else {
          throw new Error("template engine not supported or not specified");
        }
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("default view not set or unsupported view engine.");
    }
  };
  res.sendFile = function (filepath) {
    if (
      path.extname(filepath) != ".html" ||
      path.extname(filepath) != ".html"
    ) {
      res.status(403).json({
        message: "File type not supported",
      });
    } else {
      let pathToJoin = publicFolder
        ? publicFolder
        : path.join(__dirname, "../");
      const resolvedPath = path.join(pathToJoin, filepath);
      try {
        const stats = fs.statSync(resolvedPath);

        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Length", stats.size);
        res.statusCode = 200;

        const readStream = fs.createReadStream(resolvedPath);
        readStream.pipe(res);
      } catch (error) {
        res.status(500).json({
          message: "Server error",
        });
      }
    }
  };
}

module.exports = response;
