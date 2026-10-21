/**
 * Utilitários de datas para o cálculo de diárias e agendamento de reservas
 */

// Retorna uma nova data somando dias
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Retorna a diferença em dias entre duas datas (mínimo de 1 diária)
export function getDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
}

// Formata dia e mês (ex: "24/10")
export function formatDayMonth(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// Formata data completa (ex: "24/10/2026")
export function formatFullDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Formata data amigável com dia da semana (ex: "Sex, 24 de Out")
export function formatFriendlyDate(date) {
  const d = new Date(date);
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const weekday = weekdays[d.getDay()];
  const day = d.getDate();
  const month = months[d.getMonth()];
  
  return `${weekday}, ${day} de ${month}`;
}

// Converte string "DD/MM" ou "DD/MM/YYYY" para Date
export function parseDateString(dateStr, defaultYear = 2026) {
  if (!dateStr) return new Date(defaultYear, 9, 20); // 20/10/2026
  
  if (dateStr instanceof Date) return dateStr;
  
  const parts = dateStr.split('/');
  if (parts.length >= 2) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts.length >= 3 ? parseInt(parts[2], 10) : defaultYear;
    return new Date(year, month, day);
  }
  
  return new Date(dateStr);
}

// Gera a matriz do calendário para um determinado ano e mês (0-11)
export function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const matrix = [];
  let currentWeek = [];
  
  // Preenche dias vazios antes do 1º dia
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  
  // Preenche os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    
    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Preenche dias vazios no fim da última semana
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    matrix.push(currentWeek);
  }
  
  return matrix;
}

// Verifica se duas datas são no mesmo dia
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Verifica se uma data está entre outras duas (inclusive)
export function isBetweenDates(date, startDate, endDate) {
  if (!date || !startDate || !endDate) return false;
  const d = new Date(date).setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);
  return d > start && d < end;
}
