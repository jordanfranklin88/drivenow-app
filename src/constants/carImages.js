export const CarImages = {
  '1': {
    thumbnail: require('../../assets/cars/mobi_1.jpg'),
    gallery: [
      { id: 'img-1-1', title: 'Frente 3/4', source: require('../../assets/cars/mobi_1.jpg') },
      { id: 'img-1-2', title: 'Cockpit & Painel', source: require('../../assets/cars/mobi_2.jpg') },
      { id: 'img-1-3', title: 'Traseira & Lateral', source: require('../../assets/cars/mobi_3.jpg') },
      { id: 'img-1-4', title: 'Visual Urbano', source: require('../../assets/cars/mobi_4.jpg') },
    ],
  },
  '2': {
    thumbnail: require('../../assets/cars/hb20_1.jpg'),
    gallery: [
      { id: 'img-2-1', title: 'Frente 3/4 Novo HB20', source: require('../../assets/cars/hb20_1.jpg') },
      { id: 'img-2-2', title: 'Traseira & Linhas LED', source: require('../../assets/cars/hb20_2.jpg') },
      { id: 'img-2-3', title: 'Detalhes Dianteiros', source: require('../../assets/cars/hb20_3.jpg') },
      { id: 'img-2-4', title: 'Perfil Aerodinâmico', source: require('../../assets/cars/hb20_4.jpg') },
    ],
  },
  '3': {
    thumbnail: require('../../assets/cars/renegade_1.jpg'),
    gallery: [
      { id: 'img-3-1', title: 'Frente 3/4 Aventureiro', source: require('../../assets/cars/renegade_1.jpg') },
      { id: 'img-3-2', title: 'Lateral & Rodas Liga Leve', source: require('../../assets/cars/renegade_2.jpg') },
      { id: 'img-3-3', title: 'Traseira com Lanternas X', source: require('../../assets/cars/renegade_3.jpg') },
      { id: 'img-3-4', title: 'Design Imponente', source: require('../../assets/cars/renegade_4.jpg') },
    ],
  },
  '4': {
    thumbnail: require('../../assets/cars/corolla_1.jpg'),
    gallery: [
      { id: 'img-4-1', title: 'Sedan Executivo Híbrido', source: require('../../assets/cars/corolla_1.jpg') },
      { id: 'img-4-2', title: 'Traseira Sofisticada', source: require('../../assets/cars/corolla_2.jpg') },
      { id: 'img-4-3', title: 'Visual Salão Internacional', source: require('../../assets/cars/corolla_3.jpg') },
      { id: 'img-4-4', title: 'Perfil & Elegância', source: require('../../assets/cars/corolla_4.jpg') },
    ],
  },
  '5': {
    thumbnail: require('../../assets/cars/toro_1.jpg'),
    gallery: [
      { id: 'img-5-1', title: 'Grade Imponente Volcano', source: require('../../assets/cars/toro_1.jpg') },
      { id: 'img-5-2', title: 'Versão Ultra 2026', source: require('../../assets/cars/toro_2.jpg') },
      { id: 'img-5-3', title: 'Caçamba e Traseira Dupla', source: require('../../assets/cars/toro_3.jpg') },
      { id: 'img-5-4', title: 'Força & Robustez', source: require('../../assets/cars/toro_4.jpg') },
    ],
  },
  '6': {
    thumbnail: require('../../assets/cars/polo_1.jpg'),
    gallery: [
      { id: 'img-6-1', title: 'Visual Polo TSI 2026', source: require('../../assets/cars/polo_1.jpg') },
      { id: 'img-6-2', title: 'Design Esportivo', source: require('../../assets/cars/polo_2.jpg') },
      { id: 'img-6-3', title: 'Traseira & Dinâmica', source: require('../../assets/cars/polo_3.jpg') },
      { id: 'img-6-4', title: 'Faróis Full LED', source: require('../../assets/cars/polo_4.jpg') },
    ],
  },
};

export function getVehicleImage(vehicleOrId) {
  const id = typeof vehicleOrId === 'object' ? vehicleOrId?.id : vehicleOrId;
  if (id && CarImages[id]) {
    return CarImages[id].thumbnail;
  }
  const name = typeof vehicleOrId === 'object' ? vehicleOrId?.name || vehicleOrId?.carName : '';
  if (/mobi/i.test(name)) return CarImages['1'].thumbnail;
  if (/hb20/i.test(name)) return CarImages['2'].thumbnail;
  if (/renegade/i.test(name)) return CarImages['3'].thumbnail;
  if (/corolla/i.test(name)) return CarImages['4'].thumbnail;
  if (/toro/i.test(name)) return CarImages['5'].thumbnail;
  if (/polo/i.test(name)) return CarImages['6'].thumbnail;

  return null;
}

export function getVehicleGallery(vehicleOrId) {
  const id = typeof vehicleOrId === 'object' ? vehicleOrId?.id : vehicleOrId;
  if (id && CarImages[id]) {
    return CarImages[id].gallery;
  }
  const name = typeof vehicleOrId === 'object' ? vehicleOrId?.name || vehicleOrId?.carName : '';
  if (/mobi/i.test(name)) return CarImages['1'].gallery;
  if (/hb20/i.test(name)) return CarImages['2'].gallery;
  if (/renegade/i.test(name)) return CarImages['3'].gallery;
  if (/corolla/i.test(name)) return CarImages['4'].gallery;
  if (/toro/i.test(name)) return CarImages['5'].gallery;
  if (/polo/i.test(name)) return CarImages['6'].gallery;

  return [];
}
