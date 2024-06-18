#!/bin/bash

# Chemins relatifs
SRC_DIR="src"
PROGRAM_NAME="LancerRestaurant"

# Aller dans le répertoire de service restaurant
cd "${SRC_DIR}/serviceRestaurant" || exit

# Commande pour exécuter le programme Java avec le classpath incluant le fichier JAR
RUN_CMD="java -cp .:./mysql.jar ${PROGRAM_NAME}"

# Lancer le programme dans un nouveau terminal
echo ""
echo "Lancement du Service Restaurant..."
gnome-terminal -- bash -c "${RUN_CMD}; exec bash" &
echo "Service lancé"

# Revenir au répertoire serviceProxy
cd ../serviceProxy || exit

PROGRAM_NAME="LancerProxy"
RUN_CMD="java ${PROGRAM_NAME}"

echo ""
echo "Lancement du service Proxy (travaux & établissements d'enseignement sup.)..."
gnome-terminal -- bash -c "${RUN_CMD}; exec bash" &
echo "Service proxy lancé"

# Revenir au répertoire API
cd ../API || exit

PROGRAM_NAME="ServiceHttp"
RUN_CMD="java ${PROGRAM_NAME}"

echo ""
echo "Lancement du Serveur HTTP..."
gnome-terminal -- bash -c "${RUN_CMD}; exec bash" &
echo "Serveur en ligne !"

