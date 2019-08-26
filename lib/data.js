var fs = require('fs');
var path = require('path');
var helper = require('./helper');
var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function (dir, filename, data, callback) {
   
    let path = lib.baseDir + dir + '/' + filename + '.json'
        var stringData = JSON.stringify( [data]);

        try {
            if (fs.existsSync(path)) {
              //file exists
              var file = require(path);
              data.id = file.length;
            //   data.dateCreated = function() { return new Date().getTime(); }
              file.push(data);
              fs.writeFileSync(path, JSON.stringify(file), err => {
                  if (!err) {
                      callback("registeration successful")
                  }
              })

          
            }else {
        
              fs.writeFileSync(path, stringData, err => {
                  if (err) {
                      console.log('Error writing file', err)
                  } else {
                      console.log('Successfully wrote file')
                  }
              })
            }
          } catch(err) {
            console.error(err)
          }
}

lib.read = function (dir, filename, callback) {
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json','utf-8',  function(err, data){
        if(!err && data){
            callback(false, helper.parsejsonObject(data));
        }else{
            callback(err, data);
        }
    })

}

lib.update = function (dir, filename, data, callback) {

}

lib.delete = function (dir, filename, callback) {

}

lib.add = function (dir, filename, data, callback) {
    var file = require(lib.baseDir + dir + '/' + filename + '.json')
    console.log('THIS IS THE file1', file)
    Data = JSON.stringify(data)
    file.users.push(JSON.parse(Data));
    fs.writeFile(filename + '.json', JSON.stringify(file),  function (err) {
        if (!err) {
            callback("user added");
        } else {
            callback("Error writing to file");
        }
    });
    console.log('THIS IS THE DATA', data)
    console.log('THIS IS THE file', file)
    

}

module.exports = lib;