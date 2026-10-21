import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import {
  addDays,
  getDaysDifference,
  formatDayMonth,
  formatFullDate,
  formatFriendlyDate,
  getMonthMatrix,
  isSameDay,
  isBetweenDates,
  parseDateString,
} from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const QUICK_DAYS = [
  { label: '1 dia', days: 1 },
  { label: '2 dias', days: 2 },
  { label: '3 dias (FDS)', days: 3 },
  { label: '5 dias', days: 5 },
  { label: '7 dias (1 sem)', days: 7 },
  { label: '10 dias', days: 10 },
  { label: '15 dias', days: 15 },
  { label: '30 dias', days: 30 },
];

const AVAILABLE_HOURS = [
  '06:00', '07:00', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '20:00', '21:00', '22:00', '23:00'
];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function DateRangePickerModal({
  visible,
  onClose,
  initialPickupDate,
  initialReturnDate,
  initialPickupTime = '10:00',
  initialReturnTime = '10:00',
  initialDays = 4,
  onConfirm,
}) {
  const [pickupDate, setPickupDate] = useState(() => {
    return initialPickupDate ? parseDateString(initialPickupDate) : new Date(2026, 9, 20);
  });

  const [returnDate, setReturnDate] = useState(() => {
    if (initialReturnDate) {
      return parseDateString(initialReturnDate);
    }
    const start = initialPickupDate ? parseDateString(initialPickupDate) : new Date(2026, 9, 20);
    return addDays(start, initialDays);
  });

  const [days, setDays] = useState(initialDays);
  const [pickupTime, setPickupTime] = useState(initialPickupTime || '10:00');
  const [returnTime, setReturnTime] = useState(initialReturnTime || '10:00');
  const [activeSelection, setActiveSelection] = useState('return'); // 'pickup' | 'return'
  const [activeTimeTarget, setActiveTimeTarget] = useState('pickup'); // 'pickup' | 'return'

  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const base = initialPickupDate ? parseDateString(initialPickupDate) : new Date(2026, 9, 20);
    return base.getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const base = initialPickupDate ? parseDateString(initialPickupDate) : new Date(2026, 9, 20);
    return base.getFullYear();
  });

  // Sincroniza sempre que abrir o modal
  useEffect(() => {
    if (visible) {
      const pDate = initialPickupDate ? parseDateString(initialPickupDate) : new Date(2026, 9, 20);
      let rDate;
      let calculatedDays = initialDays;

      if (initialReturnDate) {
        rDate = parseDateString(initialReturnDate);
        calculatedDays = getDaysDifference(pDate, rDate);
      } else {
        rDate = addDays(pDate, initialDays);
      }

      setPickupDate(pDate);
      setReturnDate(rDate);
      setDays(calculatedDays);
      setPickupTime(initialPickupTime || '10:00');
      setReturnTime(initialReturnTime || '10:00');
      setCurrentMonthIndex(pDate.getMonth());
      setCurrentYear(pDate.getFullYear());
      setActiveSelection('return');
      setActiveTimeTarget('pickup');
    }
  }, [visible, initialPickupDate, initialReturnDate, initialPickupTime, initialReturnTime, initialDays]);

  // Alterar dias via stepper ou atalhos
  const handleSetDays = (newDays) => {
    if (newDays < 1) return;
    setDays(newDays);
    const newReturnDate = addDays(pickupDate, newDays);
    setReturnDate(newReturnDate);
  };

  // Navegar meses
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  // Clique em um dia do calendário
  const handleSelectDay = (date) => {
    if (!date) return;

    if (activeSelection === 'pickup') {
      setPickupDate(date);
      if (date >= returnDate) {
        const newReturn = addDays(date, days > 0 ? days : 1);
        setReturnDate(newReturn);
      } else {
        const diff = getDaysDifference(date, returnDate);
        setDays(diff);
      }
      setActiveSelection('return');
      setActiveTimeTarget('return');
    } else {
      if (date <= pickupDate) {
        setPickupDate(date);
        const newReturn = addDays(date, days > 0 ? days : 1);
        setReturnDate(newReturn);
        setActiveSelection('return');
        setActiveTimeTarget('return');
      } else {
        setReturnDate(date);
        const diff = getDaysDifference(pickupDate, date);
        setDays(diff);
      }
    }
  };

  // Alterar horário selecionado
  const handleSelectHour = (hour) => {
    if (activeTimeTarget === 'pickup') {
      setPickupTime(hour);
    } else {
      setReturnTime(hour);
    }
  };

  // Confirmar seleção
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
        days,
        pickupDateShort: formatDayMonth(pickupDate),
        returnDateShort: formatDayMonth(returnDate),
        pickupDateFull: formatFullDate(pickupDate),
        returnDateFull: formatFullDate(returnDate),
        pickupDateFriendly: formatFriendlyDate(pickupDate),
        returnDateFriendly: formatFriendlyDate(returnDate),
        pickupDateTimeStr: `${formatDayMonth(pickupDate)} às ${pickupTime}`,
        returnDateTimeStr: `${formatDayMonth(returnDate)} às ${returnTime}`,
      });
    }
    onClose();
  };

  const monthMatrix = getMonthMatrix(currentYear, currentMonthIndex);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Barra Superior */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Período e Horários</Text>
              <Text style={styles.headerSubtitle}>
                Escolha o dia, horário e quantidade de diárias
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Cards de Retirada e Devolução */}
            <View style={styles.dateCardsRow}>
              {/* Card Retirada */}
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeSelection === 'pickup' && styles.dateCardActive,
                ]}
                onPress={() => {
                  setActiveSelection('pickup');
                  setActiveTimeTarget('pickup');
                  setCurrentMonthIndex(pickupDate.getMonth());
                  setCurrentYear(pickupDate.getFullYear());
                }}
                activeOpacity={0.8}
              >
                <View style={styles.dateCardHeader}>
                  <Ionicons
                    name="calendar"
                    size={16}
                    color={activeSelection === 'pickup' ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dateCardBadge,
                      activeSelection === 'pickup' && styles.dateCardBadgeActive,
                    ]}
                  >
                    RETIRADA
                  </Text>
                </View>
                <Text style={styles.dateCardDay}>{formatFriendlyDate(pickupDate)}</Text>
                <View style={styles.timeTag}>
                  <Ionicons name="time-outline" size={12} color={Colors.primary} />
                  <Text style={styles.timeTagText}>{pickupTime}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dateCardArrow}>
                <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
              </View>

              {/* Card Devolução */}
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  activeSelection === 'return' && styles.dateCardActive,
                ]}
                onPress={() => {
                  setActiveSelection('return');
                  setActiveTimeTarget('return');
                  setCurrentMonthIndex(returnDate.getMonth());
                  setCurrentYear(returnDate.getFullYear());
                }}
                activeOpacity={0.8}
              >
                <View style={styles.dateCardHeader}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={activeSelection === 'return' ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dateCardBadge,
                      activeSelection === 'return' && styles.dateCardBadgeActive,
                    ]}
                  >
                    DEVOLUÇÃO
                  </Text>
                </View>
                <Text style={styles.dateCardDay}>{formatFriendlyDate(returnDate)}</Text>
                <View style={styles.timeTag}>
                  <Ionicons name="time-outline" size={12} color={Colors.primary} />
                  <Text style={styles.timeTagText}>{returnTime}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Seletor de Horários */}
            <View style={styles.timeSectionContainer}>
              <View style={styles.timeSectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="time" size={16} color={Colors.primary} />
                  <Text style={styles.timeSectionTitle}>
                    {activeTimeTarget === 'pickup'
                      ? 'Horário de Retirada'
                      : 'Horário de Devolução'}
                  </Text>
                </View>

                {/* Alternador de Retirada / Devolução */}
                <View style={styles.timeTargetToggle}>
                  <TouchableOpacity
                    style={[
                      styles.timeToggleBtn,
                      activeTimeTarget === 'pickup' && styles.timeToggleBtnActive,
                    ]}
                    onPress={() => setActiveTimeTarget('pickup')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeToggleText,
                        activeTimeTarget === 'pickup' && styles.timeToggleTextActive,
                      ]}
                    >
                      Retirada ({pickupTime})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.timeToggleBtn,
                      activeTimeTarget === 'return' && styles.timeToggleBtnActive,
                    ]}
                    onPress={() => setActiveTimeTarget('return')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeToggleText,
                        activeTimeTarget === 'return' && styles.timeToggleTextActive,
                      ]}
                    >
                      Devolução ({returnTime})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lista Horizontal de Horários */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hoursListContainer}
              >
                {AVAILABLE_HOURS.map((hour) => {
                  const isCurrentHour =
                    activeTimeTarget === 'pickup'
                      ? pickupTime === hour
                      : returnTime === hour;

                  return (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.hourChip,
                        isCurrentHour && styles.hourChipSelected,
                      ]}
                      onPress={() => handleSelectHour(hour)}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={isCurrentHour ? Colors.textOnPrimary : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.hourChipText,
                          isCurrentHour && styles.hourChipTextSelected,
                        ]}
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Seletor de Diárias (Stepper) */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="speedometer-outline" size={18} color={Colors.primary} />
                  <Text style={styles.stepperTitle}>Quantidade de Diárias</Text>
                </View>
                <View style={styles.stepperBadge}>
                  <Text style={styles.stepperBadgeText}>
                    {days} {days === 1 ? 'diária' : 'diárias'}
                  </Text>
                </View>
              </View>

              <View style={styles.stepperControlRow}>
                <TouchableOpacity
                  style={[styles.stepperBtn, days <= 1 && styles.stepperBtnDisabled]}
                  onPress={() => handleSetDays(days - 1)}
                  disabled={days <= 1}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={days <= 1 ? Colors.textLight : Colors.textPrimary}
                  />
                </TouchableOpacity>

                <View style={styles.stepperValueContainer}>
                  <Text style={styles.stepperValueNumber}>{days}</Text>
                  <Text style={styles.stepperValueLabel}>
                    {days === 1 ? 'diária selecionada' : 'diárias selecionadas'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleSetDays(days + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Atalhos rápidos de diárias */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickChipsContainer}
              >
                {QUICK_DAYS.map((item) => {
                  const isSelected = days === item.days;
                  return (
                    <TouchableOpacity
                      key={item.days}
                      style={[
                        styles.quickChip,
                        isSelected && styles.quickChipSelected,
                      ]}
                      onPress={() => handleSetDays(item.days)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          isSelected && styles.quickChipTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Calendário Mensal */}
            <View style={styles.calendarContainer}>
              {/* Barra de Navegação do Mês */}
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  style={styles.monthNavBtn}
                  onPress={handlePrevMonth}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>

                <Text style={styles.monthNavTitle}>
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </Text>

                <TouchableOpacity
                  style={styles.monthNavBtn}
                  onPress={handleNextMonth}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Cabeçalho dos dias da semana */}
              <View style={styles.weekDaysRow}>
                {WEEKDAY_NAMES.map((w, idx) => (
                  <Text key={idx} style={styles.weekDayText}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* Grade de Dias */}
              <View style={styles.matrixContainer}>
                {monthMatrix.map((week, weekIdx) => (
                  <View key={weekIdx} style={styles.weekRow}>
                    {week.map((dateItem, dayIdx) => {
                      if (!dateItem) {
                        return <View key={dayIdx} style={styles.dayCellEmpty} />;
                      }

                      const isPickup = isSameDay(dateItem, pickupDate);
                      const isReturn = isSameDay(dateItem, returnDate);
                      const isInRange = isBetweenDates(dateItem, pickupDate, returnDate);
                      const isPast = false;

                      return (
                        <TouchableOpacity
                          key={dayIdx}
                          style={[
                            styles.dayCell,
                            isInRange && styles.dayCellInRange,
                            isPickup && styles.dayCellPickup,
                            isReturn && styles.dayCellReturn,
                          ]}
                          onPress={() => handleSelectDay(dateItem)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              (isPickup || isReturn) && styles.dayTextSelected,
                              isInRange && styles.dayTextInRange,
                              isPast && styles.dayTextPast,
                            ]}
                          >
                            {dateItem.getDate()}
                          </Text>
                          {isPickup && <View style={styles.dayDot} />}
                          {isReturn && (
                            <View style={[styles.dayDot, { backgroundColor: '#FFFFFF' }]} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Legenda do Calendário */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.legendText}>Retirada / Devolução</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.primaryLight }]} />
                  <Text style={styles.legendText}>Período Selecionado</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Rodapé com Resumo e Ação */}
          <View style={styles.footer}>
            <View style={styles.footerSummary}>
              <Text style={styles.footerSummaryDays}>
                {days} {days === 1 ? 'diária' : 'diárias'}
              </Text>
              <Text style={styles.footerSummaryDates}>
                {formatDayMonth(pickupDate)} ({pickupTime}) até {formatDayMonth(returnDate)} ({returnTime})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmButtonText}>
                Confirmar ({days} {days === 1 ? 'dia' : 'dias'})
              </Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '94%',
    paddingBottom: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dateCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  dateCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  dateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dateCardBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  dateCardBadgeActive: {
    color: Colors.primaryDark,
  },
  dateCardDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  dateCardArrow: {
    paddingHorizontal: 8,
  },
  timeSectionContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  timeSectionHeader: {
    marginBottom: 10,
  },
  timeSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeTargetToggle: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginTop: 8,
  },
  timeToggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  timeToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeToggleTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  hoursListContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  hourChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  hourChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hourChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  hourChipTextSelected: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
  },
  stepperContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepperTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepperBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepperBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  stepperControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.5,
  },
  stepperValueContainer: {
    alignItems: 'center',
  },
  stepperValueNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepperValueLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  quickChipsContainer: {
    gap: 8,
    marginTop: 12,
    paddingVertical: 2,
  },
  quickChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickChipTextSelected: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthNavTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 6,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    width: (width - 72) / 7,
    textAlign: 'center',
  },
  matrixContainer: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayCellEmpty: {
    width: (width - 72) / 7,
    height: 38,
  },
  dayCell: {
    width: (width - 72) / 7,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
  },
  dayCellInRange: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 0,
  },
  dayCellPickup: {
    backgroundColor: Colors.primary,
    borderRadius: 19,
  },
  dayCellReturn: {
    backgroundColor: Colors.primary,
    borderRadius: 19,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayTextSelected: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
  },
  dayTextInRange: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  dayTextPast: {
    color: Colors.textLight,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 6,
  },
  footerSummary: {
    flex: 1,
    marginRight: 12,
  },
  footerSummaryDays: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  footerSummaryDates: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
  },
});
