import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonRequests from "../services/PokemonRequests";

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pokemon, setPokemon] = useState<any | null>(null);
    const [theme, setTheme] = useState<'light'|'dark'>('dark');

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setPokemon(null);
        Keyboard.dismiss();

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                setPokemon(result);
                setSearchQuery("");
            } else {
                setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
            }
        } catch (error) {
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const colors = theme === 'dark' ? {
        bg: '#0b1220',
        surface: '#07101a',
        card: '#07121b',
        text: '#e6eef6',
        subtle: '#a9b4c0',
        inputBg: '#0e1720',
        border: '#12202a',
        primary: '#ff5c5c',
        typeBg: '#1b2630',
        typeText: '#a8d1ff'
    } : {
        bg: '#f7f7fb',
        surface: '#ffffff',
        card: '#ffffff',
        text: '#0b1b2b',
        subtle: '#394955',
        inputBg: '#fff',
        border: '#e6e9ee',
        primary: '#ff3b3b',
        typeBg: '#eef2ff',
        typeText: '#3730a3'
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }] }>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.headerRow}>
                    <Text style={[styles.title, {
                        color: theme === 'dark' ? '#ffde00' : '#0b1b2b',
                        ...(theme === 'dark' ? {
                            textShadowColor: '#0b2346',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 3
                        } : {})
                    }]}>
                        PokéSearch 🔍
                    </Text>
                    <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { borderColor: colors.border }] }>
                        <Text style={{ color: colors.text }}>{theme === 'dark' ? 'Escuro' : 'Claro'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.subtitle, { color: colors.subtle }] }>
                    Busque por nome ou número. O app mostra imagem, tipagem e descrição.
                </Text>

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                        placeholder="Ex: bulbasaur ou 1"
                        placeholderTextColor={colors.subtle}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSearch} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Buscar</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {errorMsg ? <Text style={[styles.error, { color: '#ffb4b4' }]}>{errorMsg}</Text> : null}

                {pokemon ? (
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.imageWrap}>
                            <Image
                                source={{ uri: pokemon.pokemon_image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={[styles.info, { backgroundColor: 'transparent' }]}>
                            <View style={styles.nameRow}>
                                <Text style={[styles.name, { color: colors.text }]}>{pokemon.pokemon_name}</Text>
                                <Text style={[styles.id, { color: colors.subtle }]}>#{pokemon.pokemon_id}</Text>
                            </View>

                            <View style={styles.typesContainer}>
                                {Array.isArray(pokemon.types) && pokemon.types.map((t: string) => (
                                    <View key={t} style={[styles.typeBadge, { backgroundColor: colors.typeBg }] }>
                                        <Text style={[styles.typeText, { color: colors.typeText }]}>{t}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={[styles.description, { color: colors.text }]}>{pokemon.description || 'Descrição não disponível.'}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.hintBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.hintTitle, { color: colors.text }]}>Dica</Text>
                        <Text style={[styles.hintText, { color: colors.subtle }]}>Tente: bulbasaur, pikachu, charmander ou números como 1, 25, 4.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f7f7fb' },
    container: { padding: 20, paddingTop: Platform.OS === 'android' ? 30 : 20 },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-condensed'
    },
    subtitle: { color: '#394955', marginBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    themeButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        color: '#0b1b2b',
        fontSize: 16,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#e6e9ee'
    },
    button: {
        marginLeft: 12,
        backgroundColor: '#ff3b3b',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: { color: '#fff', fontWeight: '700' },
    error: { color: 'red', marginTop: 10 },
    card: {
        marginTop: 20,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1
    },
    imageWrap: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
    image: { width: 100, height: 100 },
    info: { flex: 1, paddingLeft: 12 },
    nameRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    name: { fontSize: 20, fontWeight: '700', textTransform: 'capitalize', color: '#0b1b2b' },
    id: { color: '#6b7280', marginLeft: 8 },
    typesContainer: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
    typeBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginTop: 6 },
    typeText: { color: '#3730a3', fontWeight: '600', textTransform: 'capitalize' },
    description: { marginTop: 10, color: '#374151' },
    hintBox: { marginTop: 24, backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#eef2f5' },
    hintTitle: { fontWeight: '700', marginBottom: 6 },
    hintText: { color: '#475569' }
});
