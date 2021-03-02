// toastr.success("");
// toastr.info("");
// toastr.warning("");
// toastr.error("");

window.onload = function () {
    var fileInput = document.getElementById('fileInput');
    var file;

    var textType = /text.*/;
    var excelType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    var nameTable;
    //CARREGA O ARQUIVO DO INPUT E DEIXA EM MEMORIA
    fileInput.addEventListener('change', function (e) {
        file = fileInput.files[0];

        if (file != null) {
            document.getElementById('lbFileInput').innerHTML = file.name;
        } else {
            document.getElementById('lbFileInput').innerHTML = "Escolha um arquivo";
        }

    });

    //AÇÃO DO BOTÃO DE GERAR ARQUIVO
    $('form').submit(function (evt) {
        evt.preventDefault();
        nameTable = document.getElementById('dataTable').value;
        console.log(nameTable);
        if (file.type.match(textType)) {
            convertTxtToJson(file, nameTable);
        } else if (file.type.match(excelType)) {
            convertExcelToJson(file, nameTable);
        } else {
            toastr.warning("Arquivo Invalido");
            console.log("Arquivo Invalido");
        }
    });

    document
        .getElementById("copy")
        .addEventListener("click", function () {
            var copyText = document.getElementById('jsonData').innerHTML;
            const textArea = document.createElement('textarea');
            textArea.textContent = copyText;
            document.body.append(textArea);
            textArea.select();
            document.execCommand("copy");
            textArea.remove();
            toastr.success("Copiado!");
        });
}

function convertTxtToJson(file, nameTable) {
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = reader.result;
           
            const LINHA_INICIO_LEITURA = 7;
            const allLines = content.split(/\r\n|\n/);
            
            var cargaCbco = new Array;
            allLines.forEach((line, i) => {
                if (line.trim() != "" && i >= LINHA_INICIO_LEITURA - 1) {
                    row = new Object();
                    row.CBCO = line.substring(2, 8).trim();
                    row.CDIGBCO = line.substring(10, 14).trim();
                    row.IBCO = line.substring(16, 56).trim();
                    row.ETELEG = line.substring(58, 73).trim();
                    row.CCGCCPF = line.substring(75, 87).trim();
                    row.CFLIALCGC = line.substring(89, 97).trim();
                    row.CCTRLCGC = line.substring(99, 104).trim();
                    row.IFANTSBCO = line.substring(106, 121).trim();
                    row.ELOGDR = line.substring(123, 153).trim();
                    row.DINCL = line.substring(155, 165).trim();
                    row.CIDTFDBCOATIVO = line.substring(167, 173).trim();
                    row.CCEPCOMPL = line.substring(175, 181).trim();
                    row.CCEP = line.substring(183, 191).trim();
                    row.CMUNIBGE = line.substring(193, 203).trim();
                    row.CUSODOCTOELETR = line.substring(205, 206).trim();
                    cargaCbco.push(row);
                }
            });
            writeSql(gerarInsertSql(cargaCbco, nameTable));
            console.log(cargaCbco);
        }

        reader.readAsText(file);
    }
}

function convertExcelToJson(file, nameTable) {
    if (file) {
        console.log("hi");
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var data = event.target.result;

            var workbook = XLSX.read(data, {
                type: "binary"
            });
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheet],

                );
                rowObject = rowObject.slice(3, rowObject.length);
                console.log(rowObject)
                var rowExcel;
                var cargaCbco = new Array;
                for (const value of rowObject) {
                    rowExcel = new Object();
                    rowExcel.CBCO = getValue(value.__EMPTY);
                    rowExcel.CDIGBCO = getValue(value.__EMPTY_1);
                    rowExcel.IBCO = getValue(value.__EMPTY_2);
                    rowExcel.ETELEG = getValue(value.__EMPTY_3);
                    rowExcel.CCGCCPF = getValue(value.__EMPTY_4);
                    rowExcel.CFLIALCGC = getValue(value.__EMPTY_5);
                    rowExcel.CCTRLCGC = getValue(value.__EMPTY_6);
                    rowExcel.IFANTSBCO = getValue(value.__EMPTY_7);
                    rowExcel.ELOGDR = getValue(value.__EMPTY_8);
                    rowExcel.DINCL = getValue(value.__EMPTY_9);
                    rowExcel.CIDTFDBCOATIVO = getValue(value.CIDTFD);
                    rowExcel.CCEPCOMPL = getValue(value.__EMPTY_10);
                    rowExcel.CCEP = getValue(value.__EMPTY_11);
                    rowExcel.CMUNIBGE = getValue(value.__EMPTY_12);
                    rowExcel.CUSODOCTOELETR = getValue(value.CUSO);
                    cargaCbco.push(rowExcel);
                }
                writeSql(gerarInsertSql(cargaCbco, nameTable));
            });
        };
    }
    fileReader.readAsBinaryString(file);
}

function gerarInsertSql(array, nameTable) {
    let resultado = new Array
    for (const value of array) {
        let insert = `INSERT INTO ${nameTable} (CBCO, CDIGBCO, IBCO, ETELEG, CCGCCPF, CFLIALCGC, CCTRLCGC, IFANTSBCO, ELOGDR, DINCL, CIDTFDBCOATIVO, CCEPCOMPL, CCEP, CMUNIBGE, CUSODOCTOELETR) 
                                        VALUES (${value.CBCO}, '${value.CDIGBCO}', '${value.IBCO}', '${value.ETELEG}', ${value.CCGCCPF}, 
                                            ${value.CFLIALCGC}, ${value.CCTRLCGC}, '${value.IFANTSBCO}', '${value.ELOGDR}', '${value.DINCL}', '${value.CIDTFDBCOATIVO}', ${value.CCEPCOMPL}, ${value.CCEP}, ${value.CMUNIBGE}, '${value.CUSODOCTOELETR}');`
        resultado.push(insert);
    }
    console.log(resultado)
    return resultado
}

function writeSql(insert) {
    document.getElementById("boxResult")?.classList.remove("invisible");
    document.getElementById('jsonData').innerHTML = insert;
    console.log(insert);
}

function getValue(value){
    return value != undefined ? value : "";
}