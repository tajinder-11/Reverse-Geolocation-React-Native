import {StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

import {COLORS} from '../../../utilities/constants';

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  section: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.grey3,
    marginHorizontal: scale(16),
  },
  sectionTitle: {
    marginBottom: verticalScale(4),
  },
  sectionDescription: {
    color: COLORS.grey2,
    marginBottom: verticalScale(16),
  },
  resultsSection: {
    marginTop: verticalScale(8),
  },
  errorContainer: {
    backgroundColor: COLORS.red1 + '15',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: verticalScale(12),
  },
  errorText: {
    color: COLORS.red1,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: COLORS.grey1,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  resultLabel: {
    color: COLORS.blue1,
    marginBottom: verticalScale(8),
  },
  resultValue: {
    marginBottom: verticalScale(4),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.grey3,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.grey2,
    marginBottom: verticalScale(2),
  },
});

export default styles;