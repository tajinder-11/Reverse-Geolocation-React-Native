import React, {useState, useCallback, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Keyboard, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Button from '../../../commonComponents/Button';
import Header from '../../../commonComponents/Header';
import Loader from '../../../commonComponents/Loader';
import {Body1, Body2, Heading3} from '../../../commonComponents/TextComponents';
import TextInputWithLabel from '../../../commonComponents/TextInputWithLabel';
import Wrapper from '../../../commonComponents/Wrapper';
import NativeGeocoder, {
  Coordinates,
  GeocodedPlacemark,
} from '../../../modules/NativeGeocoder';
import {COLORS} from '../../../utilities/constants';

import styles from './styles';

type useSelectorType = {
  geocoding: {
    loading: boolean;
  };
};

const DEBOUNCE_DELAY = 500;

const GeocodingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const isLoading = useSelector(
    (state: useSelectorType) => state.geocoding.loading,
  );

  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [reverseResult, setReverseResult] = useState<GeocodedPlacemark | null>(
    null,
  );
  const [forwardResult, setForwardResult] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reverseDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const forwardDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleReverseGeocode = useCallback(() => {
    if (!latitude || !longitude) {
      setError(t('enterCoordinates'));
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setError(t('invalidCoordinates'));
      return;
    }

    setError(null);

    if (reverseDebounceTimer.current) {
      clearTimeout(reverseDebounceTimer.current);
    }

    reverseDebounceTimer.current = setTimeout(async () => {
      dispatch({
        type: 'geocoding/setLoading',
        payload: true,
      });

      try {
        const placemark: GeocodedPlacemark =
          await NativeGeocoder.getAddressFromCoordinates({
            latitude: lat,
            longitude: lng,
          });

        setReverseResult(placemark);
        setForwardResult(null);
      } catch (err) {
        setError(t('geocodingFailed'));
        setReverseResult(null);
      } finally {
        dispatch({
          type: 'geocoding/setLoading',
          payload: false,
        });
      }
    }, DEBOUNCE_DELAY);
  }, [latitude, longitude, t, dispatch]);

  const handleForwardGeocode = useCallback(() => {
    if (!addressInput.trim()) {
      setError(t('enterAddress'));
      return;
    }

    setError(null);

    const address = addressInput.trim();

    if (forwardDebounceTimer.current) {
      clearTimeout(forwardDebounceTimer.current);
    }

    forwardDebounceTimer.current = setTimeout(async () => {
      dispatch({
        type: 'geocoding/setLoading',
        payload: true,
      });

      try {
        const coords: Coordinates =
          await NativeGeocoder.getCoordinatesFromAddress(address);

        setForwardResult(coords);
        setReverseResult(null);
      } catch (err) {
        setError(t('geocodingFailed'));
        setForwardResult(null);
      } finally {
        dispatch({
          type: 'geocoding/setLoading',
          payload: false,
        });
      }
    }, DEBOUNCE_DELAY);
  }, [addressInput, t, dispatch]);

  const clearResults = useCallback(() => {
    setReverseResult(null);
    setForwardResult(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (reverseDebounceTimer.current) {
        clearTimeout(reverseDebounceTimer.current);
      }

      if (forwardDebounceTimer.current) {
        clearTimeout(forwardDebounceTimer.current);
      }
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <Wrapper>
        <Header title={t('geocoding')} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onTouchStart={dismissKeyboard}>
          <View style={styles.section}>
            <Heading3 style={styles.sectionTitle}>
              {t('reverseGeocoding')}
            </Heading3>

            <Body2 style={styles.sectionDescription}>
              {t('reverseGeocodingDesc')}
            </Body2>

            <TextInputWithLabel
              label={t('latitude')}
              placeholder={t('latitudePlaceholder')}
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="decimal-pad"
              containerMarginTop={16}
              containerMarginHorizontal={16}
              errorMessage={undefined}
            />

            <TextInputWithLabel
              label={t('longitude')}
              placeholder={t('longitudePlaceholder')}
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="decimal-pad"
              containerMarginTop={12}
              containerMarginHorizontal={16}
              errorMessage={undefined}
            />

            <Button
              label={t('getAddress')}
              onPress={handleReverseGeocode}
              marginTop={16}
              marginHorizontal={16}
              height={48}
            />
          </View>

          <View style={[styles.section, styles.divider]} />

          <View style={styles.section}>
            <Heading3 style={styles.sectionTitle}>
              {t('forwardGeocoding')}
            </Heading3>

            <Body2 style={styles.sectionDescription}>
              {t('forwardGeocodingDesc')}
            </Body2>

            <TextInputWithLabel
              label={t('address')}
              placeholder={t('addressPlaceholder')}
              value={addressInput}
              onChangeText={setAddressInput}
              containerMarginTop={16}
              containerMarginHorizontal={16}
              errorMessage={undefined}
            />

            <Button
              label={t('getCoordinates')}
              onPress={handleForwardGeocode}
              marginTop={16}
              marginHorizontal={16}
              height={48}
            />
          </View>

          {(reverseResult || forwardResult || error) && (
            <View style={[styles.section, styles.resultsSection]}>
              <Heading3 style={styles.sectionTitle}>{t('results')}</Heading3>

              {error && (
                <View style={styles.errorContainer}>
                  <Body1 style={styles.errorText}>{error}</Body1>
                </View>
              )}

              {reverseResult && (
                <View style={styles.resultCard}>
                  <Body1 style={styles.resultLabel}>{t('address')}</Body1>

                  <Body1 style={styles.resultValue}>
                    {reverseResult.street}, {reverseResult.city},{' '}
                    {reverseResult.state} {reverseResult.postalCode},{' '}
                    {reverseResult.country}
                  </Body1>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Body2 style={styles.detailLabel}>{t('city')}</Body2>

                      <Body1>{reverseResult.city}</Body1>
                    </View>

                    <View style={styles.detailItem}>
                      <Body2 style={styles.detailLabel}>{t('country')}</Body2>

                      <Body1>{reverseResult.country}</Body1>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Body2 style={styles.detailLabel}>{t('state')}</Body2>

                      <Body1>{reverseResult.state}</Body1>
                    </View>

                    <View style={styles.detailItem}>
                      <Body2 style={styles.detailLabel}>
                        {t('postalCode')}
                      </Body2>

                      <Body1>{reverseResult.postalCode}</Body1>
                    </View>
                  </View>
                </View>
              )}

              {forwardResult && (
                <View style={styles.resultCard}>
                  <Body1 style={styles.resultLabel}>{t('coordinates')}</Body1>

                  <Body1 style={styles.resultValue}>
                    {t('latitudeLabel')}: {forwardResult.latitude.toFixed(6)}
                  </Body1>

                  <Body1 style={styles.resultValue}>
                    {t('longitudeLabel')}: {forwardResult.longitude.toFixed(6)}
                  </Body1>
                </View>
              )}

              <Button
                label={t('clear')}
                onPress={clearResults}
                marginTop={16}
                marginHorizontal={16}
                transparent
                bgColor={COLORS.red1}
                labelColor={COLORS.red1}
                borderRadius={8}
              />
            </View>
          )}
        </ScrollView>
      </Wrapper>

      {isLoading && (
        <Loader loading={true} absolute={true} loaderColor={COLORS.black1} />
      )}
    </>
  );
};

export default GeocodingScreen;
