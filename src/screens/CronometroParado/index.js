import React from 'react';
import Contador from '../../components/Contador';

export default function CronometroParado({route}) {

  const {colocacoes, dia, hora, diaHora, minutos, revisitas, videosMostrados} = route.params;

  return (
    <>
      <Contador relatorioId={false} minutosProp={minutos} colocacoesProp={colocacoes} videosMostradosProp={videosMostrados} revisitasProp={revisitas} observacoesProp={''} diaHora={diaHora} diaProp={dia} horaProp={hora} paginaCronometroParado />
    </>
  )
}
