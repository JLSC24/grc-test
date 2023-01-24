import React from "react";
import ExportExcel from "react-export-excel-xlsx-fix";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColum = ExportExcel.ExcelColum;

export default function Report(props) {
  const { eroData } = props;
  const control_data = eroData[0].control;
  const riesgo_data = eroData[0].riesgo;
  const riesgo_control_data = eroData[0].riesgo_control;

  /*
INTENTANDO GENERAR ESTILOS AL EXCEL, NOTAMOS QUE LA LIBRERÍA NO LO PERMITE EN MODO data, debe ser dataSet
  const riesgo_data = [
    {
        columns: [
          {title: "Id Proceso", width: {wpx: 80}}
        ],
        data: [
          {value : eroData[0].riesgo['idproceso'], style: {font: {sz: "24", bold: true}}}
        
        ]


    }



  ];
*/
  return (
    <div className="content-info">
          <ExcelFile 
            filename={"Resumen_" + eroData[0].riesgo[0].idproceso}
            element={
              <buttonPositivo> 
                Descargar Resumen
               </buttonPositivo>
            }
          >
            <ExcelSheet data={riesgo_data} name="Riesgos">
              <ExcelColum label="Id Proceso" value="idproceso" />
              <ExcelColum label="Id Riesgo" value="idriesgo" />
              <ExcelColum label="Nombre Riesgo" value="nombre_riesgo" />
              <ExcelColum label="Descripcion General" value="descripcion_general"/>
              <ExcelColum label="Categoria Corporativa" value="categoria_corporativa"/>
              <ExcelColum label="SubCategoria Corporativa" value="sub_categoria_corporativa"/>
              <ExcelColum label="Exposicion Inherente" value="exposicion_inherente"/>
              <ExcelColum label="Efectividad_control" value="efectividad_control"/>
              <ExcelColum label="Exposicion Residual" value="exposicion_residual"/>
              <ExcelColum label="Nivel Riesgo Residual" value="nivel_riesgo_residual"/>
              
            </ExcelSheet>
            <ExcelSheet data={control_data} name="Controles">
              <ExcelColum label="Id Proceso" value="idproceso" />
              <ExcelColum label="Id Control" value="id_control" />
              <ExcelColum label="Id Control en Proceso" value="id_control_en_proceso"/>
              <ExcelColum label="Nombre Control" value="nombre" />
              <ExcelColum label="Descripcion Control" value="descripcion" />
              <ExcelColum label="Naturaleza" value="naturaleza" />
              <ExcelColum label="Automatización" value="automatizacion" />
              <ExcelColum label="Periodicidad" value="periodicidad" />
              <ExcelColum label="Evidencia" value="evidencia" />
              <ExcelColum label="Ruta de la evidencia" value="ruta_de_la_evidencia" />
              <ExcelColum label="Responsable" value="responsable" />
              <ExcelColum label="Control ejecutado en" value="control_ejecutado_en" />
            </ExcelSheet>
            <ExcelSheet data={riesgo_control_data} name="Asociación riesgo control">
              <ExcelColum label="Id Proceso" value="idproceso" />
              <ExcelColum label="Id Riesgo" value="idriesgo" />
              <ExcelColum label="Id Control" value="id_control" />
            </ExcelSheet>
          </ExcelFile>
    </div>
  );
}
