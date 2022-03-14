import React from 'react';
import Contador from '../../components/Contador';

import moment from "moment";
import { format } from "date-fns";

export default function RelatorioAdicionar({route}) {

  const mesAno = route.params;
  const mesAnoFormatado = moment(`${mesAno}`, 'MMMM yy', true).format('MM/YYYY');  
  let dia = '01';
  
  // Verifica se está no mês atual e seta o dia de hoje, se não, seta o dia 01 como padrão
  if(mesAnoFormatado === format(new Date(), 'MM/yyyy')){
    dia = format(new Date(), 'dd');
  }

  return (
    <>
      <Contador observacoesProp={''} diaProp={`${dia}/${mesAnoFormatado}`} horaProp={`${format(new Date(), 'HH:mm')}`} paginaRelatorioAdicionar />
    </>
  )
}