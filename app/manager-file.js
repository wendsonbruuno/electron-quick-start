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

        if(file != null){
            document.getElementById('lbFileInput').innerHTML = file.name;
        }else{
            document.getElementById('lbFileInput').innerHTML = "Escolha um arquivo";
        }

    });

    //AÇÃO DO BOTÃO DE GERAR ARQUIVO
    $('form').submit(function (evt) {
        evt.preventDefault();
        nameTable = document.getElementById('dataTable').value;
        console.log(nameTable);
        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var content = reader.result;
                console.log(content);
            }

            reader.readAsText(file);
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
                    rowExcel.CBCO = value.__EMPTY;
                    rowExcel.CDIGBCO = value.__EMPTY_1;
                    rowExcel.IBCO = value.__EMPTY_2;
                    rowExcel.ETELEG = value.__EMPTY_3;
                    rowExcel.CCGCCPF = value.__EMPTY_4;
                    rowExcel.CFLIALCGC = value.__EMPTY_5;
                    rowExcel.CCTRLCGC = value.__EMPTY_6;
                    rowExcel.IFANTSBCO = value.__EMPTY_7;
                    rowExcel.ELOGDR = value.__EMPTY_8;
                    rowExcel.DINCL = value.__EMPTY_9;
                    rowExcel.CIDTFDBCOATIVO = value.CIDTFD;
                    rowExcel.CCEPCOMPL = value.__EMPTY_10;
                    rowExcel.CCEP = value.__EMPTY_11;
                    rowExcel.CMUNIBGE = value.__EMPTY_12;
                    rowExcel.CUSODOCTOELETR = value.CUSO;
                    cargaCbco.push(rowExcel);
                }
                writeSql(gerarInsertSql(cargaCbco, nameTable));
            });
        };
    }

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