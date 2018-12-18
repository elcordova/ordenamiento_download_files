var _ = require('lodash');
var limit_Download = 5 * 1024 * 1024;
require('fs').readFile('data.json', 'utf8', function (err, data) {
    const parse = JSON.parse(data.replace(/\r?\n|\r|\t|\s|/g, ''))
    objectsArray = parse['RESULT'];
    newArray=getFileLimit(objectsArray);
});



function getFileLimit(files){
    let tempSize = 0;
    
    let filterFilesArray = files.sort((obj1, obj2) => obj1.FILESIZE - obj2.FILESIZE).filter(file => {
        tempSize = tempSize + file.FILESIZE*1;
        let booladFilter= tempSize < limit_Download;
        return booladFilter;
    });

    let tempPendingFiles= files.filter(file => {
        tempSize = tempSize + file.FILESIZE*1;
        let booladFilter= tempSize >= limit_Download;
        return booladFilter;
    });
    console.log('filtrado:' ,filterFilesArray );
    console.log('restante:', tempPendingFiles);


    if(tempPendingFiles.length>0){
        return [filterFilesArray, getFileLimit(tempPendingFiles)];
    }else{
        return filterFilesArray;
    }
    

}