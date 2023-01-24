import React from "react";
import ExportExcel from "react-export-excel-xlsx-fix";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColum = ExportExcel.ExcelColum;

export default function Report(props) {
  const { delegatesData } = props;
  const delegates_data = delegatesData[0].delegates;

  return (
    <div className="content-info">
      <ExcelFile
        filename={"Delegados_"}
        element={<buttonPositivo>Descargar Delegados</buttonPositivo>}
      >
        <ExcelSheet data={delegates_data} name="Delegados">
          <ExcelColum label="id_delegados" value="id_delegados" />
          <ExcelColum
            label="id_delegado_proceso"
            value="id_delegado_proceso_id"
          />
          <ExcelColum
            label="id_resposable_proceso"
            value="id_resposable_proceso_id"
          />
          <ExcelColum label="fecha_de_delegacion" value="fecha_de_delegacion" />
          <ExcelColum label="nombre_delegado" value="nombre_x" />
          <ExcelColum label="email_delegado" value="email_x" />
          <ExcelColum label="nombre_responsable" value="nombre_y" />
          <ExcelColum label="email_responsable" value="email_y" />
        </ExcelSheet>
      </ExcelFile>
    </div>
  );
}
