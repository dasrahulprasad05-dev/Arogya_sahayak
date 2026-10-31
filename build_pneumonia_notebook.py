"""
Script to generate the complete Google Colab Jupyter Notebook:
01_train_pneumonia_scanner.ipynb
"""

import json
import os

def make_cell(cell_type, source, execution_count=None, outputs=None):
    if isinstance(source, list):
        formatted_source = [s if s.endswith('\n') else s + '\n' for s in source]
        # remove newline from last line if present
        if formatted_source:
            formatted_source[-1] = formatted_source[-1].rstrip('\n')
    else:
        formatted_source = [source]
    
    cell = {
        "cell_type": cell_type,
        "metadata": {},
        "source": formatted_source
    }
    if cell_type == "code":
        cell["execution_count"] = execution_count
        cell["outputs"] = outputs or []
    return cell

cells = []

# ==========================================
# CELL 1: Markdown Title & Academic Header
# ==========================================
cells.append(make_cell("markdown", [
    "# 🫁 Arogya Sahayak — Deep Learning Scanner 01: Pneumonia Detection",
    "### End-to-End Transfer Learning, Clinical Evaluation, Real Grad-CAM & TensorFlow.js Export",
    "",
    "**Project:** Arogya Sahayak — Offline-First Multilingual Rural Telemedicine Assistant  ",
    "**Institution:** ABIT Cuttack, Affiliated to BPUT Odisha  ",
    "**Student Developers:** Rahul Prasad Das (2301206094), Purnachandra Swain (2301206093), Rohit Kumar Thakur (2301206103), Ritik Kumar Swain (2301206102)  ",
    "**Project Guide:** Prof. Rajesh Kumar Sahoo, Assistant Professor, Dept. of CSE  ",
    "**Constraint:** 100% Free Tiers (Google Colab T4 GPU, Kaggle Datasets, Zero Cost)  ",
    "",
    "---",
    "",
    "### 🎯 Objectives of this Notebook:",
    "1. **Zero-Leakage Medical Data Pipeline:** Parse Kaggle Chest X-ray images into 3 distinct clinical classes (`Normal`, `Bacterial Pneumonia`, `Viral Pneumonia`) and enforce a **patient-grouped split** so images from the same patient never leak into both training and evaluation sets.",
    "2. **MobileNetV2 Transfer Learning:** Leverage pre-trained ImageNet representations, freeze base feature extractors, train a specialized dense classification head, and fine-tune upper convolutional blocks with low learning rate ($10^{-5}$).",
    "3. **Clinical Evaluation Metrics:** Compute per-class Sensitivity (Recall), Specificity, Precision, F1-Score, Multi-class ROC AUC curves, and Confusion Matrices.",
    "4. **Genuine Explainable AI (Grad-CAM):** Extract real gradient activation maps from the final convolutional layer (`Conv_1`) to verify the network focuses on focal pulmonary consolidations and interstitial opacities rather than background artifacts.",
    "5. **TensorFlow.js & Model Card Packaging:** Export the trained neural network into web-optimized `model.json` + binary weight shards (~12 MB), generate an auditable Mitchell et al. `model_card.json` and `metrics.json`, and package everything into a downloadable ZIP for direct integration into Arogya Sahayak."
]))

# ==========================================
# CELL 2: Environment Setup & GPU Check
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 1. Environment Setup & Hardware Acceleration",
    "Verify GPU availability (NVIDIA Tesla T4 on free Colab) and install necessary packages (`kagglehub` for zero-auth dataset download, `tensorflowjs` for web export, and imaging libraries)."
]))

cells.append(make_cell("code", [
    "# Check GPU accelerator",
    "!nvidia-smi",
    "",
    "# Install dependencies (quiet mode)",
    "!pip install -q kagglehub tensorflowjs scikit-learn seaborn matplotlib pandas pillow",
    "",
    "import os",
    "import re",
    "import glob",
    "import json",
    "import shutil",
    "import random",
    "import numpy as np",
    "import pandas as pd",
    "import matplotlib.pyplot as plt",
    "import seaborn as sns",
    "from PIL import Image",
    "",
    "import tensorflow as tf",
    "from tensorflow import keras",
    "from tensorflow.keras import layers",
    "from tensorflow.keras.applications import MobileNetV2",
    "from tensorflow.keras.applications.mobilenet_v2 import preprocess_input",
    "",
    "from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve",
    "from sklearn.utils.class_weight import compute_class_weight",
    "",
    "# Reproducibility",
    "SEED = 42",
    "random.seed(SEED)",
    "np.random.seed(SEED)",
    "tf.random.set_seed(SEED)",
    "",
    "print(f\"TensorFlow Version: {tf.__version__}\")",
    "print(f\"GPU Devices Available: {tf.config.list_physical_devices('GPU')}\")"
]))

# ==========================================
# CELL 3: Download Kaggle Dataset
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 2. Dataset Acquisition (Kaggle Chest X-Ray Images)",
    "We use the gold-standard pediatric chest radiograph dataset from Guangzhou Women and Children’s Medical Center (`paultimothymooney/chest-xray-pneumonia`).  ",
    "Using `kagglehub`, public datasets can be downloaded directly inside Colab **without needing any manual API keys or tokens**."
]))

cells.append(make_cell("code", [
    "import kagglehub",
    "",
    "print(\"Initiating zero-cost dataset download via KaggleHub...\")",
    "# Downloads the latest version of the chest X-ray pneumonia dataset",
    "dataset_raw_path = kagglehub.dataset_download(\"paultimothymooney/chest-xray-pneumonia\")",
    "print(f\"Dataset downloaded to: {dataset_raw_path}\")",
    "",
    "# Explore subfolders",
    "for root, dirs, files in os.walk(dataset_raw_path):",
    "    depth = root[len(dataset_raw_path):].count(os.sep)",
    "    if depth < 3:",
    "        print(f\"{'  ' * depth}📁 {os.path.basename(root)}/ ({len(files)} files)\")"
]))

# ==========================================
# CELL 4: Patient-Grouped Split & 3-Class Parsing
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 3. Data Ingestion & Patient-Level Leakage Prevention",
    "",
    "> [!IMPORTANT]",
    "> **Preventing Data Leakage in Medical Deep Learning:**  ",
    "> In medical imaging, patients often have multiple X-rays taken at different times. If images are split randomly, images from Patient #42 could appear in both training and test sets, artificially inflating accuracy to ~99% while failing on real patients.  ",
    "> We extract the unique Patient ID from filenames (`personXXXX_...`) and perform **Grouped Stratified Splitting** so a patient's images exist exclusively in one partition.",
    "",
    "### Clinical Target Classes (Matching Arogya Sahayak Config):",
    "1. **`0: Normal`** — Clear lung fields, intact diaphragmatic domes, sharp costophrenic angles.",
    "2. **`1: Bacterial Pneumonia`** — Dense focal consolidation, lobar opacification, air bronchograms.",
    "3. **`2: Viral Pneumonia`** — Diffuse bilateral interstitial infiltrates, reticular or ground-glass opacities."
]))

cells.append(make_cell("code", [
    "# Find all images across train, test, val folders to form a unified cohort",
    "all_image_paths = glob.glob(os.path.join(dataset_raw_path, \"**\", \"*.jpeg\"), recursive=True)",
    "all_image_paths += glob.glob(os.path.join(dataset_raw_path, \"**\", \"*.jpg\"), recursive=True)",
    "all_image_paths += glob.glob(os.path.join(dataset_raw_path, \"**\", \"*.png\"), recursive=True)",
    "",
    "records = []",
    "for path in all_image_paths:",
    "    fname = os.path.basename(path)",
    "    parent_dir = os.path.basename(os.path.dirname(path)).upper()",
    "    ",
    "    # Determine clinical label",
    "    if \"NORMAL\" in parent_dir or \"NORMAL\" in fname.upper():",
    "        label_idx = 0",
    "        label_name = \"Normal\"",
    "        # Extract patient ID from normal filenames (e.g. IM-0115-0001 or NORMAL2-IM-0262)",
    "        m = re.search(r\"(IM-\\d+|NORMAL\\d*-IM-\\d+)\", fname)",
    "        patient_id = m.group(1) if m else fname.split(\"-\")[0]",
    "    elif \"virus\" in fname.lower():",
    "        label_idx = 2",
    "        label_name = \"Viral Pneumonia\"",
    "        m = re.search(r\"person(\\d+)_virus\", fname.lower())",
    "        patient_id = f\"person_{m.group(1)}\" if m else fname.split(\"_\")[0]",
    "    elif \"bacteria\" in fname.lower():",
    "        label_idx = 1",
    "        label_name = \"Bacterial Pneumonia\"",
    "        m = re.search(r\"person(\\d+)_bacteria\", fname.lower())",
    "        patient_id = f\"person_{m.group(1)}\" if m else fname.split(\"_\")[0]",
    "    else:",
    "        # Fallback if pneumonia type is not explicitly in filename",
    "        label_idx = 1",
    "        label_name = \"Bacterial Pneumonia\"",
    "        patient_id = fname.split(\"_\")[0]",
    "        ",
    "    records.append({",
    "        \"filepath\": path,",
    "        \"filename\": fname,",
    "        \"patient_id\": patient_id,",
    "        \"label_idx\": label_idx,",
    "        \"label_name\": label_name",
    "    })",
    "",
    "df_all = pd.DataFrame(records)",
    "print(f\"Total Radiographs Ingested: {len(df_all)}\")",
    "print(f\"Total Unique Patients: {df_all['patient_id'].nunique()}\")",
    "print(\"\\nClass Distribution across all available data:\")",
    "print(df_all['label_name'].value_counts())"
]))

# ==========================================
# CELL 5: Grouped Train-Val-Test Split
# ==========================================
cells.append(make_cell("code", [
    "# Perform Patient-Level Split: 70% Train, 15% Validation, 15% Test",
    "unique_patients = df_all[['patient_id', 'label_name']].drop_duplicates(subset=['patient_id'])",
    "",
    "from sklearn.model_selection import train_test_split",
    "",
    "# Split patients into train (70%) and temp (30%)",
    "patients_train, patients_temp = train_test_split(",
    "    unique_patients['patient_id'].values,",
    "    test_size=0.30,",
    "    random_state=SEED,",
    "    stratify=unique_patients['label_name'].values",
    ")",
    "",
    "# Split temp patients into validation (15%) and test (15%)",
    "temp_sub = unique_patients[unique_patients['patient_id'].isin(patients_temp)]",
    "patients_val, patients_test = train_test_split(",
    "    temp_sub['patient_id'].values,",
    "    test_size=0.50,",
    "    random_state=SEED,",
    "    stratify=temp_sub['label_name'].values",
    ")",
    "",
    "df_train = df_all[df_all['patient_id'].isin(patients_train)].copy().reset_index(drop=True)",
    "df_val = df_all[df_all['patient_id'].isin(patients_val)].copy().reset_index(drop=True)",
    "df_test = df_all[df_all['patient_id'].isin(patients_test)].copy().reset_index(drop=True)",
    "",
    "print(f\"Training Set:   {len(df_train)} images from {len(patients_train)} patients\")",
    "print(f\"Validation Set: {len(df_val)} images from {len(patients_val)} patients\")",
    "print(f\"Test Set:       {len(df_test)} images from {len(patients_test)} patients\")",
    "",
    "# Verify zero overlap between patient sets",
    "assert len(set(patients_train).intersection(set(patients_test))) == 0, \"LEAK DETECTED: Train & Test overlap!\"",
    "assert len(set(patients_val).intersection(set(patients_test))) == 0, \"LEAK DETECTED: Val & Test overlap!\"",
    "print(\"\\nZero data leakage confirmed: All partitions have mutually exclusive patient cohorts.\")"
]))

# ==========================================
# CELL 6: Sample Visualization
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 4. Visualizing Clinical Cases",
    "Let's inspect representative chest radiographs from each class."
]))

cells.append(make_cell("code", [
    "CLASS_NAMES = ['Normal Clear Lung', 'Bacterial Pneumonia', 'Viral Pneumonia']",
    "",
    "fig, axes = plt.subplots(1, 3, figsize=(15, 5))",
    "for idx, cname in enumerate(['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia']):",
    "    sample_row = df_train[df_train['label_name'] == cname].iloc[0]",
    "    img = Image.open(sample_row['filepath']).convert('RGB')",
    "    axes[idx].imshow(img, cmap='bone')",
    "    axes[idx].set_title(f\"Class {idx}: {cname}\\nPatient: {sample_row['patient_id']}\", fontsize=11, fontweight='bold')",
    "    axes[idx].axis('off')",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 7: Input Preprocessing & tf.data Pipeline
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 5. Input Pipeline & Medical Data Augmentation",
    "We standardize chest radiographs to $224 \\times 224 \\times 3$, apply MobileNetV2 $[-1, 1]$ normalization, and augment only with anatomically valid transforms (modest rotation $\\pm 8^\\circ$, subtle zoom $\\pm 5\\%$, brightness adjustment).  ",
    "**Note:** Vertical flipping is strictly prohibited as human thoracic anatomy is never inverted."
]))

cells.append(make_cell("code", [
    "IMG_SIZE = (224, 224)",
    "BATCH_SIZE = 32",
    "NUM_CLASSES = 3",
    "",
    "# Anatomically safe augmentation",
    "data_augmentation = keras.Sequential([",
    "    layers.RandomRotation(0.025, fill_mode='nearest'),       # max ~9 degrees",
    "    layers.RandomZoom((-0.05, 0.05), fill_mode='nearest'),   # subtle zoom",
    "    layers.RandomTranslation(0.04, 0.04, fill_mode='nearest'),",
    "    layers.RandomBrightness(0.08),",
    "], name=\"radiology_augmentation\")",
    "",
    "def load_and_preprocess_image(path, label):",
    "    img_raw = tf.io.read_file(path)",
    "    img = tf.image.decode_jpeg(img_raw, channels=3)",
    "    img = tf.image.resize(img, IMG_SIZE)",
    "    img = preprocess_input(img)  # Scales to [-1, 1] for MobileNetV2",
    "    one_hot = tf.one_hot(label, depth=NUM_CLASSES)",
    "    return img, one_hot",
    "",
    "# Build tf.data datasets",
    "def create_dataset(df, is_training=False):",
    "    paths = df['filepath'].values",
    "    labels = df['label_idx'].values",
    "    ds = tf.data.Dataset.from_tensor_slices((paths, labels))",
    "    ds = ds.map(load_and_preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)",
    "    if is_training:",
    "        ds = ds.shuffle(buffer_size=1024, seed=SEED)",
    "        ds = ds.map(lambda x, y: (data_augmentation(x, training=True), y), num_parallel_calls=tf.data.AUTOTUNE)",
    "    ds = ds.batch(BATCH_SIZE)",
    "    ds = ds.prefetch(tf.data.AUTOTUNE)",
    "    return ds",
    "",
    "train_ds = create_dataset(df_train, is_training=True)",
    "val_ds   = create_dataset(df_val, is_training=False)",
    "test_ds  = create_dataset(df_test, is_training=False)",
    "",
    "# Compute class weights to counterbalance sample distribution",
    "weights = compute_class_weight(",
    "    class_weight='balanced',",
    "    classes=np.unique(df_train['label_idx']),",
    "    y=df_train['label_idx'].values",
    ")",
    "class_weights_dict = {i: float(w) for i, w in enumerate(weights)}",
    "print(\"Balanced Class Weights for Training:\")",
    "for k, v in class_weights_dict.items():",
    "    print(f\"  Class {k} ({CLASS_NAMES[k]}): weight = {v:.3f}\")"
]))

# ==========================================
# CELL 8: Build MobileNetV2 Classifier
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 6. Model Architecture (MobileNetV2 Transfer Learning)",
    "MobileNetV2 offers high inference speed (~15ms on mobile) and compact parameter size (~3.5M weights, ~12 MB in TF.js).  ",
    "We freeze the pre-trained ImageNet backbone initially, attach a clinical classification head with Dropout regularisation, and train in two progressive phases."
]))

cells.append(make_cell("code", [
    "def build_pneumonia_model():",
    "    inputs = keras.Input(shape=(224, 224, 3), name=\"input_image\")",
    "    ",
    "    # Base MobileNetV2 backbone",
    "    base_model = MobileNetV2(",
    "        weights='imagenet',",
    "        include_top=False,",
    "        input_tensor=inputs",
    "    )",
    "    base_model.trainable = False  # Freeze for Phase 1",
    "    ",
    "    # Custom diagnostic head",
    "    x = base_model.output",
    "    x = layers.GlobalAveragePooling2D(name=\"avg_pool\")(x)",
    "    x = layers.BatchNormalization(name=\"head_bn\")(x)",
    "    x = layers.Dense(128, activation='relu', name=\"dense_128\")(x)",
    "    x = layers.Dropout(0.35, name=\"head_dropout\")(x)",
    "    outputs = layers.Dense(NUM_CLASSES, activation='softmax', name=\"pneumonia_probabilities\")(x)",
    "    ",
    "    model = keras.Model(inputs=inputs, outputs=outputs, name=\"Arogya_Pneumonia_MobileNetV2\")",
    "    return model, base_model",
    "",
    "model, base_model = build_pneumonia_model()",
    "model.summary()"
]))

# ==========================================
# CELL 9: Phase 1 Training (Feature Extraction)
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 7. Phase 1 Training: Diagnostic Head Adaptation",
    "Train the custom dense head with Adam ($10^{-3}$) while the MobileNetV2 convolutional backbone remains frozen."
]))

cells.append(make_cell("code", [
    "model.compile(",
    "    optimizer=keras.optimizers.Adam(learning_rate=1e-3),",
    "    loss='categorical_crossentropy',",
    "    metrics=['accuracy', keras.metrics.AUC(name='auc')]",
    ")",
    "",
    "callbacks_phase1 = [",
    "    keras.callbacks.EarlyStopping(monitor='val_loss', patience=4, restore_best_weights=True, verbose=1),",
    "    keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=2, min_lr=1e-6, verbose=1)",
    "]",
    "",
    "print(\"Starting Phase 1 Training (Frozen Base)...\")",
    "history_phase1 = model.fit(",
    "    train_ds,",
    "    validation_data=val_ds,",
    "    epochs=10,",
    "    class_weight=class_weights_dict,",
    "    callbacks=callbacks_phase1,",
    "    verbose=1",
    ")"
]))

# ==========================================
# CELL 10: Phase 2 Training (Fine-Tuning)
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 8. Phase 2 Training: Fine-Tuning Top Convolutional Blocks",
    "We unfreeze the top 35 layers of MobileNetV2 (including inverted residual bottleneck block 16 and final conv `Conv_1`) and train with a reduced learning rate ($10^{-5}$) to specialize the feature maps to thoracic radiographic densities."
]))

cells.append(make_cell("code", [
    "# Unfreeze top 35 layers",
    "base_model.trainable = True",
    "for layer in base_model.layers[:-35]:",
    "    layer.trainable = False",
    "",
    "trainable_count = sum(np.prod(p.shape) for p in model.trainable_weights)",
    "print(f\"Trainable parameters for fine-tuning: {trainable_count:,}\")",
    "",
    "# Recompile with lower learning rate for stable adaptation",
    "model.compile(",
    "    optimizer=keras.optimizers.Adam(learning_rate=1e-5),",
    "    loss='categorical_crossentropy',",
    "    metrics=['accuracy', keras.metrics.AUC(name='auc')]",
    ")",
    "",
    "callbacks_phase2 = [",
    "    keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1),",
    "    keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-7, verbose=1)",
    "]",
    "",
    "print(\"Starting Phase 2 Fine-Tuning...\")",
    "history_phase2 = model.fit(",
    "    train_ds,",
    "    validation_data=val_ds,",
    "    epochs=15,",
    "    class_weight=class_weights_dict,",
    "    callbacks=callbacks_phase2,",
    "    verbose=1",
    ")"
]))

# ==========================================
# CELL 11: Learning Curves Plot
# ==========================================
cells.append(make_cell("code", [
    "# Plot combined training history",
    "acc = history_phase1.history['accuracy'] + history_phase2.history['accuracy']",
    "val_acc = history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy']",
    "loss = history_phase1.history['loss'] + history_phase2.history['loss']",
    "val_loss = history_phase1.history['val_loss'] + history_phase2.history['val_loss']",
    "",
    "plt.figure(figsize=(14, 5))",
    "plt.subplot(1, 2, 1)",
    "plt.plot(acc, label='Training Accuracy', color='#10b981', lw=2)",
    "plt.plot(val_acc, label='Validation Accuracy', color='#3b82f6', lw=2)",
    "plt.axvline(x=len(history_phase1.history['accuracy'])-1, color='gray', linestyle='--', label='Fine-Tuning Start')",
    "plt.title('Pneumonia Classifier: Accuracy Trajectory', fontweight='bold')",
    "plt.xlabel('Epoch')",
    "plt.ylabel('Accuracy')",
    "plt.legend()",
    "plt.grid(alpha=0.3)",
    "",
    "plt.subplot(1, 2, 2)",
    "plt.plot(loss, label='Training Loss', color='#ef4444', lw=2)",
    "plt.plot(val_loss, label='Validation Loss', color='#f59e0b', lw=2)",
    "plt.axvline(x=len(history_phase1.history['loss'])-1, color='gray', linestyle='--', label='Fine-Tuning Start')",
    "plt.title('Pneumonia Classifier: Loss Trajectory', fontweight='bold')",
    "plt.xlabel('Epoch')",
    "plt.ylabel('Categorical Crossentropy')",
    "plt.legend()",
    "plt.grid(alpha=0.3)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 12: Independent Test Set Clinical Evaluation
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 9. Clinical Evaluation on Held-Out Test Cohort",
    "We evaluate the final fine-tuned model on our untouched patient test set to establish real-world generalizability."
]))

cells.append(make_cell("code", [
    "print(\"Evaluating on untouched Test Set...\")",
    "y_true = []",
    "y_pred_probs = []",
    "",
    "for batch_imgs, batch_labels in test_ds:",
    "    probs = model.predict(batch_imgs, verbose=0)",
    "    y_true.extend(np.argmax(batch_labels.numpy(), axis=1))",
    "    y_pred_probs.extend(probs)",
    "",
    "y_true = np.array(y_true)",
    "y_pred_probs = np.array(y_pred_probs)",
    "y_pred = np.argmax(y_pred_probs, axis=1)",
    "",
    "# Classification report",
    "report = classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4, output_dict=True)",
    "print(classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4))",
    "",
    "# Confusion Matrix",
    "cm = confusion_matrix(y_true, y_pred)",
    "cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]",
    "",
    "fig, ax = plt.subplots(1, 2, figsize=(14, 5))",
    "sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES, ax=ax[0])",
    "ax[0].set_title('Raw Confusion Matrix (Test Patients)', fontweight='bold')",
    "ax[0].set_xlabel('Predicted Label')",
    "ax[0].set_ylabel('Ground Truth')",
    "",
    "sns.heatmap(cm_norm, annot=True, fmt='.2%', cmap='Greens', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES, ax=ax[1])",
    "ax[1].set_title('Normalized Confusion Matrix (Recall / Sensitivity)', fontweight='bold')",
    "ax[1].set_xlabel('Predicted Label')",
    "ax[1].set_ylabel('Ground Truth')",
    "plt.tight_layout()",
    "plt.show()",
    "",
    "# Extract key clinical metrics",
    "sens_normal = cm[0, 0] / cm[0].sum()",
    "sens_bact   = cm[1, 1] / cm[1].sum()",
    "sens_viral  = cm[2, 2] / cm[2].sum()",
    "overall_accuracy = np.trace(cm) / np.sum(cm)",
    "",
    "print(f\"\\nSummary Clinical Sensitivity (Recall):\")",
    "print(f\"  Normal Specificity:           {sens_normal*100:.2f}%\")",
    "print(f\"  Bacterial Pneumonia Sensitivity: {sens_bact*100:.2f}%\")",
    "print(f\"  Viral Pneumonia Sensitivity:     {sens_viral*100:.2f}%\")",
    "print(f\"  Overall Test Accuracy:           {overall_accuracy*100:.2f}%\")"
]))

# ==========================================
# CELL 13: Real Grad-CAM Explainability
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 10. Real Grad-CAM (Gradient-Weighted Class Activation Mapping)",
    "",
    "> [!NOTE]",
    "> **Replacing Fake Heatmaps with Real Gradients:**  ",
    "> Previous prototype versions in the codebase approximated Grad-CAM by downsampling image activations.  ",
    "> Here, we compute **genuine gradients** $\\frac{\\partial y^c}{\\partial A^k}$ from MobileNetV2's final convolutional layer (`Conv_1`), spatially pool them, and superimpose the attention heatmap onto the radiographic field. This reveals exactly where alveolar infiltrates or consolidation triggered the classification."
]))

cells.append(make_cell("code", [
    "def make_gradcam_heatmap(img_array, model, last_conv_layer_name=\"Conv_1\", pred_index=None):",
    "    \"\"\"Calculates authentic Grad-CAM heatmap for a given input image.\"\"\"",
    "    grad_model = keras.models.Model(",
    "        inputs=[model.inputs],",
    "        outputs=[model.get_layer(last_conv_layer_name).output, model.output]",
    "    )",
    "    ",
    "    with tf.GradientTape() as tape:",
    "        conv_outputs, predictions = grad_model(img_array)",
    "        if pred_index is None:",
    "            pred_index = tf.argmax(predictions[0])",
    "        class_channel = predictions[:, pred_index]",
    "        ",
    "    # Gradient of output score with respect to feature map channels",
    "    grads = tape.gradient(class_channel, conv_outputs)",
    "    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))",
    "    ",
    "    conv_outputs = conv_outputs[0]",
    "    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]",
    "    heatmap = tf.squeeze(heatmap)",
    "    ",
    "    # ReLU on gradients (keep only positive contributions) and normalize to [0, 1]",
    "    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)",
    "    return heatmap.numpy()",
    "",
    "def overlay_gradcam(img_path, heatmap, alpha=0.45):",
    "    \"\"\"Superimpose jet heatmap on grayscale radiograph.\"\"\"",
    "    img = Image.open(img_path).convert('RGB').resize(IMG_SIZE)",
    "    img_np = np.array(img)",
    "    ",
    "    import matplotlib.cm as cm_lib",
    "    cmap = cm_lib.get_cmap(\"jet\")",
    "    heatmap_colored = cmap(heatmap)[:, :, :3]",
    "    heatmap_colored = (heatmap_colored * 255).astype(np.uint8)",
    "    heatmap_resized = Image.fromarray(heatmap_colored).resize(img.size, Image.Resampling.BICUBIC)",
    "    heatmap_resized_np = np.array(heatmap_resized)",
    "    ",
    "    superimposed = (heatmap_resized_np * alpha + img_np * (1 - alpha)).astype(np.uint8)",
    "    return img_np, heatmap_resized_np, superimposed",
    "",
    "# Demonstrate Grad-CAM on 3 test cases",
    "fig, axes = plt.subplots(3, 3, figsize=(14, 12))",
    "test_samples = [",
    "    df_test[df_test['label_idx'] == 0].iloc[0],  # Normal",
    "    df_test[df_test['label_idx'] == 1].iloc[0],  # Bacterial",
    "    df_test[df_test['label_idx'] == 2].iloc[0]   # Viral",
    "]",
    "",
    "for row_idx, sample in enumerate(test_samples):",
    "    img_p = sample['filepath']",
    "    raw_img = Image.open(img_p).convert('RGB').resize(IMG_SIZE)",
    "    arr = preprocess_input(np.expand_dims(np.array(raw_img, dtype=np.float32), axis=0))",
    "    ",
    "    preds = model.predict(arr, verbose=0)[0]",
    "    pred_idx = np.argmax(preds)",
    "    conf = preds[pred_idx] * 100",
    "    ",
    "    heatmap = make_gradcam_heatmap(arr, model, last_conv_layer_name=\"Conv_1\", pred_index=pred_idx)",
    "    original, heat_map_img, superimposed = overlay_gradcam(img_p, heatmap)",
    "    ",
    "    axes[row_idx, 0].imshow(original, cmap='bone')",
    "    axes[row_idx, 0].set_title(f\"True: {sample['label_name']}\", fontsize=10)",
    "    axes[row_idx, 0].axis('off')",
    "    ",
    "    axes[row_idx, 1].imshow(heat_map_img)",
    "    axes[row_idx, 1].set_title(f\"Conv_1 Grad-CAM Attention\", fontsize=10)",
    "    axes[row_idx, 1].axis('off')",
    "    ",
    "    axes[row_idx, 2].imshow(superimposed)",
    "    axes[row_idx, 2].set_title(f\"Pred: {CLASS_NAMES[pred_idx]} ({conf:.1f}%)\", fontsize=10, fontweight='bold', color='navy')",
    "    axes[row_idx, 2].axis('off')",
    "",
    "plt.suptitle('Clinical Explainability: Real Gradient Heatmaps on Thoracic Infiltrates', fontsize=14, fontweight='bold', y=1.02)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 14: Export to TensorFlow.js
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 11. TensorFlow.js Web Export (Client-Side In-Browser Inference)",
    "We convert the Keras model into TensorFlow.js format (`model.json` + `group1-shard1of1.bin`).  ",
    "This allows Arogya Sahayak to execute **sub-50ms inference directly on user mobile phones without any cloud server API or network bandwidth**."
]))

cells.append(make_cell("code", [
    "import tensorflowjs as tfjs",
    "",
    "EXPORT_DIR = \"./arogya_pneumonia_tfjs\"",
    "os.makedirs(EXPORT_DIR, exist_ok=True)",
    "",
    "# Save native Keras model first",
    "keras_model_path = os.path.join(EXPORT_DIR, \"pneumonia_mobilenetv2.keras\")",
    "model.save(keras_model_path)",
    "print(f\"Saved Keras model: {keras_model_path}\")",
    "",
    "# Convert to TensorFlow.js Layers Model",
    "tfjs_target_path = os.path.join(EXPORT_DIR, \"web_model\")",
    "tfjs.converters.save_keras_model(model, tfjs_target_path)",
    "print(f\"TensorFlow.js model exported successfully to: {tfjs_target_path}\")",
    "",
    "# List exported files and sizes",
    "for f in os.listdir(tfjs_target_path):",
    "    size_mb = os.path.getsize(os.path.join(tfjs_target_path, f)) / (1024 * 1024)",
    "    print(f\"  📄 {f} ({size_mb:.2f} MB)\")"
]))

# ==========================================
# CELL 15: Generate Model Card & Metrics JSON
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 12. Model Card & Audit Metadata Generation",
    "In accordance with ISO/IEEE AI ethics and the Mitchell et al. Model Card standard, we emit transparent metadata detailing dataset provenance, sensitivity/specificity limits, and clinical safeguards."
]))

cells.append(make_cell("code", [
    "import datetime",
    "",
    "model_card = {",
    "    \"schema_version\": \"1.0.0\",",
    "    \"model_name\": \"Arogya Sahayak Pneumonia MobileNetV2 Classifier\",",
    "    \"scanner_id\": \"pneumonia\",",
    "    \"modality\": \"Chest Radiograph (PA/AP)\",",
    "    \"input_dimensions\": [224, 224, 3],",
    "    \"preprocessing\": \"MobileNetV2 scale [-1, 1]\",",
    "    \"classes\": [",
    "        {\"index\": 0, \"id\": \"normal\", \"label\": \"Normal Clear Lung Parenchyma\", \"sensitivity\": float(sens_normal)},",
    "        {\"index\": 1, \"id\": \"bacterial_pneumonia\", \"label\": \"Bacterial Pneumonia (Focal Consolidation)\", \"sensitivity\": float(sens_bact)},",
    "        {\"index\": 2, \"id\": \"viral_pneumonia\", \"label\": \"Viral Pneumonia (Bilateral Interstitial Opacity)\", \"sensitivity\": float(sens_viral)}",
    "    ],",
    "    \"metrics\": {",
    "        \"overall_test_accuracy\": float(overall_accuracy),",
    "        \"macro_avg_f1\": float(report['macro avg']['f1-score']),",
    "        \"weighted_avg_f1\": float(report['weighted avg']['f1-score']),",
    "        \"bacterial_recall\": float(report['Bacterial Pneumonia']['recall']),",
    "        \"viral_recall\": float(report['Viral Pneumonia']['recall']),",
    "        \"normal_recall\": float(report['Normal Clear Lung']['recall'])",
    "    },",
    "    \"calibrated_threshold\": 0.50,",
    "    \"last_conv_layer\": \"Conv_1\",",
    "    \"training_metadata\": {",
    "        \"date\": datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\"),",
    "        \"institution\": \"ABIT Cuttack / BPUT Odisha\",",
    "        \"developers\": [\"Rahul Prasad Das\", \"Purnachandra Swain\", \"Rohit Kumar Thakur\", \"Ritik Kumar Swain\"],",
    "        \"guide\": \"Prof. Rajesh Kumar Sahoo\",",
    "        \"dataset_source\": \"Kaggle Chest X-ray Images (Guangzhou Women and Children's Medical Center)\",",
    "        \"training_patients\": len(patients_train),",
    "        \"validation_patients\": len(patients_val),",
    "        \"test_patients\": len(patients_test),",
    "        \"hardware\": \"Google Colab Tesla T4 GPU (Free Tier)\"",
    "    },",
    "    \"clinical_safety_notice\": \"SCREENING AID ONLY. Not intended as a standalone diagnostic device. Any consolidation or infiltrate detected must be corroborated by physical auscultation, clinical history, and verified by a licensed radiologist or pulmonologist.\"",
    "}",
    "",
    "model_card_file = os.path.join(tfjs_target_path, \"model_card.json\")",
    "with open(model_card_file, 'w', encoding='utf-8') as f:",
    "    json.dump(model_card, f, indent=2)",
    "",
    "metrics_file = os.path.join(tfjs_target_path, \"metrics.json\")",
    "with open(metrics_file, 'w', encoding='utf-8') as f:",
    "    json.dump(report, f, indent=2)",
    "",
    "print(\"Model Card & Audit Metrics JSON generated successfully.\")",
    "print(json.dumps(model_card, indent=2))"
]))

# ==========================================
# CELL 16: Package into ZIP & Download
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 13. Package & Download Model for Arogya Sahayak Integration",
    "Packages the exported web model files (`model.json`, weight shards, `model_card.json`, and `metrics.json`) into `arogyasahayak_pneumonia_model.zip` and triggers an automatic browser download."
]))

cells.append(make_cell("code", [
    "import zipfile",
    "from google.colab import files",
    "",
    "zip_filename = \"arogyasahayak_pneumonia_model.zip\"",
    "print(f\"Creating deployment archive: {zip_filename}...\")",
    "",
    "with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:",
    "    for root, dirs, filenames in os.walk(tfjs_target_path):",
    "        for fname in filenames:",
    "            fpath = os.path.join(root, fname)",
    "            arcname = os.path.relpath(fpath, tfjs_target_path)",
    "            zipf.write(fpath, arcname)",
    "            print(f\"  Added: {arcname}\")",
    "",
    "zip_size_mb = os.path.getsize(zip_filename) / (1024 * 1024)",
    "print(f\"\\nPackage ready! Size: {zip_size_mb:.2f} MB\")",
    "print(\"Initiating browser download to your local machine...\")",
    "files.download(zip_filename)",
    "",
    "print(\"\"\"",
    "==========================================================================",
    "✅ DEPLOYMENT INSTRUCTIONS:",
    "1. Extract 'arogyasahayak_pneumonia_model.zip'.",
    "2. Copy the extracted files into your Arogya Sahayak repository at:",
    "   public/models/pneumonia/",
    "   (Files needed: model.json, group1-shard1of1.bin, model_card.json, metrics.json)",
    "3. Done! Arogya Sahayak will now run real deep-learning inference with",
    "   genuine Grad-CAM heatmaps on chest X-rays!",
    "==========================================================================",
    "\"\"\")"
]))

# Build notebook dict
notebook = {
    "cells": cells,
    "metadata": {
        "accelerator": "GPU",
        "colab": {
            "provenance": []
        },
        "kernelspec": {
            "display_name": "Python 3",
            "name": "python3"
        },
        "language_info": {
            "name": "python"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 0
}

output_path = os.path.join("notebooks", "01_train_pneumonia_scanner.ipynb")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(notebook, f, indent=1)

print(f"Successfully generated: {output_path}")
print(f"Total cells: {len(cells)}")
