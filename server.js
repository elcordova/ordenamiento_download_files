var _ = require('lodash');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var limit_Download = 5 * 1024 * 1024;
var arrayIds = [];
require('fs').readFile('data.json', 'utf8', function (err, data) {
    const parse = JSON.parse(data.replace(/\r?\n|\r|\t|\s|/g, ''))
    objectsArray = parse['RESULT'];
    getFileLimit(objectsArray);
    const newArrayObject = arrayIds.map(obj => {
        return {
            'ids': obj.map(data => data.FILEINFORMATIONID).join(',')
        }
    })

    console.log(newArrayObject);
    const csvWriter = createCsvWriter({
        path: 'file.csv',
        header: [{
            id: 'ids',
            title: 'IDS'
        }]
    });

    /**const records = [
        {name: 'Bob',  lang: 'French, English'},
        {name: 'Mary', lang: 'English'}
    ];**/



    csvWriter.writeRecords(newArrayObject) // returns a promise
        .then(() => {
            console.log('...Done');
        });
});



function getFileLimit(files) {
    let tempSize = 0;
    let tempPendingFiles = []

    const sortArray = files.sort((obj1, obj2) => obj1.FILESIZE - obj2.FILESIZE);
    let filterFilesArray = sortArray.filter(file => {
        tempSize = tempSize + file.FILESIZE * 1;
        let booladFilter = tempSize < limit_Download;
        return booladFilter;
    });

    if (filterFilesArray.length === 0) {
        filterFilesArray = sortArray.splice(0, 1);
        tempPendingFiles = sortArray;
    } else {
        tempSize = 0;
        tempPendingFiles = files.filter(file => {
            tempSize = tempSize + file.FILESIZE * 1;
            let booladFilter = tempSize >= limit_Download;
            return booladFilter;
        });
    }

    if (filterFilesArray.length > 0) {
        arrayIds = [...arrayIds, filterFilesArray];
    }


    if (tempPendingFiles.length > 0) {
        return [filterFilesArray, getFileLimit(tempPendingFiles)];
    } else {
        return filterFilesArray;
    }


}