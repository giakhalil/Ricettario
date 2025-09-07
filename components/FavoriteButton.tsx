import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { addToFavorites, isFavorite, removeFromFavorites } from '../utils/FavoriteStorage';

interface FavoriteButtonProps {
  recipeId: string;
  onFavoriteChange?: () => void; 
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId, onFavoriteChange }) => {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [recipeId]);

  const checkFavoriteStatus = async () => {
    const isFav = await isFavorite(recipeId);
    setFavorite(isFav);
  };

  const handleToggleFavorite = async () => {
    if (favorite) {
      await removeFromFavorites(recipeId);
      setFavorite(false);
      Alert.alert('Rimosso', 'Ricetta rimossa dai preferiti');
    } else {
      await addToFavorites(recipeId);
      setFavorite(true);
      Alert.alert('Aggiunto', 'Ricetta aggiunta ai preferiti!');
    }
    
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavorite}
      style={{
        padding: 8,
        borderRadius: 20,
        backgroundColor: favorite ? '#bc4749' : '#f0f0f0',
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 18 }}>
        {favorite ? '❤️' : '🤍'}
      </Text>
    </TouchableOpacity>
  );
};

export default FavoriteButton;