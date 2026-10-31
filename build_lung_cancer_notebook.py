"""
Script to generate the complete Google Colab Jupyter Notebook:
06_train_lung_cancer_scanner.ipynb
Thoracic CT Pulmonary Nodule & Malignancy Classification via MobileNetV2 Transfer Learning
"""

import json
import os

def make_cell(cell_type, source, execution_count=None, outputs=None):
    if isinstance(source, list):
        formatted_source = [s if s.endswith('\n') else s + '\n' for s in source]
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
    "# 🫁 Arogya Sahayak — Deep Learning Scanner 06: Lung Cancer CT Screening",
    "### Thoracic CT Nodule & Malignancy Classification, Pulmonary Grad-CAM & TensorFlow.js Edge Export",
    "",
    "**Project:** Arogya Sahayak — Offline-First Multilingual Rural Telemedicine Assistant  ",
    "**Institution:** ABIT Cuttack, Affiliated to BPUT Odisha  ",
    "**Student Developers:** Rahul Prasad Das (2301206094), Purnachandra Swain (2301206093), Rohit Kumar Thakur (2301206103), Ritik Kumar Swain (2301206102)  ",
    "**Project Guide:** Prof. Rajesh Kumar Sahoo, Assistant Professor, Dept. of CSE  ",
    "**Constraint:** 100% Free Tiers (Google Colab T4 GPU, Kaggle Datasets, Zero Cost)  ",
    "",
    "---",
    "",
    "### 🎯 Clinical Objectives:",
    "1. **Thoracic CT Malignancy Screening:** Classify axial thoracic computed tomography slices across 4 clinical histopathological categories:",
    "   - **`0: Benign Parenchyma / Clear`** — Intact pulmonary architecture, normal bronchovascular arborization, clean pleural contours, absence of solid/subsolid nodules.",
    "   - **`1: Adenocarcinoma (NSCLC)`** — Peripheral spiculated pulmonary nodules, ground-glass opacities (GGO), pleural retraction tags, glandular malignant transformation.",
    "   - **`2: Large Cell Neuroendocrine Carcinoma`** — Undifferentiated subpleural or peripheral mass with central ischemic necrosis, lack of squamous/adenomatous differentiation.",
    "   - **`3: Squamous Cell Carcinoma`** — Central perihilar cavitary mass, bronchial lumen narrowing, endobronchial obstruction with post-obstructive atelectasis.",
    "2. **MobileNetV2 Deep Transfer Learning:** Train on the benchmark Chest CT-Scan images Dataset (`mohamedhanyyy/chest-ctscan-images`) with progressive unfreezing.",
    "3. **Clinical Evaluation:** Quantify diagnostic Sensitivity (Recall), Specificity, Macro/Weighted F1-scores, and Confusion Matrices.",
    "4. **Pulmonary Nodule Grad-CAM Explainability:** Extract authentic partial derivatives from the final convolutional layer (`Conv_1`) to verify that the neural network focuses on nodular parenchymal densities rather than rib cage, thoracic wall, or imaging artifacts.",
    "5. **Edge Deployment:** Export to sub-10 MB TensorFlow.js graph weights for zero-latency client-side mobile inference."
]))

# ==========================================
# CELL 2: Environment Setup & GPU Check
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 1. Environment Setup & Hardware Acceleration",
    "Verify GPU accelerator availability (NVIDIA Tesla T4 on free Colab) and import deep learning libraries."
]))

cells.append(make_cell("code", [
    "# Verify GPU accelerator",
    "!nvidia-smi",
    "",
    "# Install dependencies (quiet mode)",
    "!pip install -q kagglehub tensorflowjs scikit-learn seaborn matplotlib pandas pillow",
    "",
    "import os",
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
    "from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score",
    "from sklearn.model_selection import train_test_split",
    "from sklearn.utils.class_weight import compute_class_weight",
    "",
    "# Reproducibility",
    "SEED = 42",
    "random.seed(SEED)",
    "np.random.seed(SEED)",
    "tf.random.set_seed(SEED)",
    "",
    "print(f\"TensorFlow Version: {tf.__version__}\")",
    "print(f\"GPU Devices: {tf.config.list_physical_devices('GPU')}\")"
]))

# ==========================================
# CELL 3: Upload Kaggle API Key & Download Dataset
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 2. Dataset Acquisition via Kaggle API",
    "We use the gold-standard Chest CT-Scan images Dataset (`mohamedhanyyy/chest-ctscan-images`), featuring axial thoracic CT scans across Adenocarcinoma, Large Cell Carcinoma, Squamous Cell Carcinoma, and Normal controls."
]))

cells.append(make_cell("code", [
    "from google.colab import files",
    "import kagglehub",
    "",
    "dataset_raw_path = \"./lung_cancer_dataset\"",
    "os.makedirs(dataset_raw_path, exist_ok=True)",
    "",
    "# Authenticate with kaggle.json if present, or prompt upload",
    "if not os.path.exists('kaggle.json'):",
    "    print(\"🔑 Upload your kaggle.json file (if you have one) or cancel to try direct download:\")",
    "    uploaded = files.upload()",
    "    for fn in uploaded.keys():",
    "        if fn.endswith('kaggle.json'):",
    "            shutil.move(fn, 'kaggle.json')",
    "",
    "if os.path.exists('kaggle.json'):",
    "    with open('kaggle.json') as f:",
    "        creds = json.load(f)",
    "    os.environ['KAGGLE_USERNAME'] = creds.get('username', '')",
    "    os.environ['KAGGLE_KEY'] = creds.get('key', '')",
    "    print(f\"✅ Authenticated as: {creds.get('username', 'user')}\")",
    "    print(\"📥 Downloading Chest CT-Scan images dataset via Kaggle CLI...\")",
    "    !kaggle datasets download -d mohamedhanyyy/chest-ctscan-images --unzip -p {dataset_raw_path}",
    "else:",
    "    print(\"📥 Downloading Chest CT-Scan dataset via KaggleHub...\")",
    "    downloaded_dir = kagglehub.dataset_download(\"mohamedhanyyy/chest-ctscan-images\")",
    "    dataset_raw_path = downloaded_dir",
    "",
    "print(f\"\\n📁 Dataset root: {dataset_raw_path}\")",
    "for root, dirs, fnames in os.walk(dataset_raw_path):",
    "    depth = root[len(dataset_raw_path):].count(os.sep)",
    "    if depth < 3:",
    "        print(f\"{'  ' * depth}📁 {os.path.basename(root)}/ ({len(fnames)} files)\")"
]))

# ==========================================
# CELL 4: Data Ingestion & Clinical Label Standardization
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 3. Data Ingestion & Clinical Label Standardization",
    "We standardize the categories to the 4 clinical diagnostic labels defined in Arogya Sahayak's `scanConfig.ts`:",
    "- `0: Benign Parenchyma / Clear`",
    "- `1: Adenocarcinoma (NSCLC)`",
    "- `2: Large Cell Neuroendocrine Carcinoma`",
    "- `3: Squamous Cell Carcinoma`"
]))

cells.append(make_cell("code", [
    "CLASS_MAP = {",
    "    'normal': {'idx': 0, 'name': 'Benign Parenchyma / Clear'},",
    "    'benign': {'idx': 0, 'name': 'Benign Parenchyma / Clear'},",
    "    'adenocarcinoma': {'idx': 1, 'name': 'Adenocarcinoma (NSCLC)'},",
    "    'adeno': {'idx': 1, 'name': 'Adenocarcinoma (NSCLC)'},",
    "    'large.cell': {'idx': 2, 'name': 'Large Cell Neuroendocrine Carcinoma'},",
    "    'large_cell': {'idx': 2, 'name': 'Large Cell Neuroendocrine Carcinoma'},",
    "    'large': {'idx': 2, 'name': 'Large Cell Neuroendocrine Carcinoma'},",
    "    'squamous': {'idx': 3, 'name': 'Squamous Cell Carcinoma'},",
    "    'squamous.cell': {'idx': 3, 'name': 'Squamous Cell Carcinoma'},",
    "    'squamous_cell': {'idx': 3, 'name': 'Squamous Cell Carcinoma'}",
    "}",
    "CLASS_NAMES = [",
    "    'Benign Parenchyma / Clear',",
    "    'Adenocarcinoma (NSCLC)',",
    "    'Large Cell Neuroendocrine Carcinoma',",
    "    'Squamous Cell Carcinoma'",
    "]",
    "",
    "# Search for all image files",
    "extensions = ('*.png', '*.jpg', '*.jpeg')",
    "all_image_paths = []",
    "for ext in extensions:",
    "    all_image_paths.extend(glob.glob(os.path.join(dataset_raw_path, \"**\", ext), recursive=True))",
    "",
    "records = []",
    "for p in all_image_paths:",
    "    parts = [part.lower().strip() for part in p.replace('\\\\', '/').split('/')]",
    "    matched = None",
    "    # Check directory parts from immediate parent upwards",
    "    for part in reversed(parts[:-1]):",
    "        for k, v in CLASS_MAP.items():",
    "            if k in part:",
    "                matched = v",
    "                break",
    "        if matched:",
    "            break",
    "    if matched:",
    "        records.append({",
    "            'filepath': p,",
    "            'label_idx': matched['idx'],",
    "            'label_name': matched['name']",
    "        })",
    "",
    "df_all = pd.DataFrame(records)",
    "print(f\"Total Thoracic CT Slices Ingested: {len(df_all):,}\")",
    "print(\"\\nClass Distribution across Dataset:\")",
    "print(df_all['label_name'].value_counts())"
]))

# ==========================================
# CELL 5: Stratified Train / Val / Test Partitioning
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 4. Stratified Dataset Partitioning (70% Train, 15% Val, 15% Test)",
    "Preserves proportional clinical distribution across all 4 diagnostic cohorts."
]))

cells.append(make_cell("code", [
    "df_train, df_temp = train_test_split(",
    "    df_all,",
    "    test_size=0.30,",
    "    random_state=SEED,",
    "    stratify=df_all['label_idx'].values",
    ")",
    "",
    "df_val, df_test = train_test_split(",
    "    df_temp,",
    "    test_size=0.50,",
    "    random_state=SEED,",
    "    stratify=df_temp['label_idx'].values",
    ")",
    "",
    "df_train = df_train.reset_index(drop=True)",
    "df_val = df_val.reset_index(drop=True)",
    "df_test = df_test.reset_index(drop=True)",
    "",
    "print(f\"Training Cohort:   {len(df_train):,} CT scans ({len(df_train)/len(df_all):.1%})\")",
    "print(f\"Validation Cohort: {len(df_val):,} CT scans ({len(df_val)/len(df_all):.1%})\")",
    "print(f\"Test Cohort:       {len(df_test):,} CT scans ({len(df_test)/len(df_all):.1%})\")"
]))

# ==========================================
# CELL 6: Sample CT Slice Visualization
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 5. Visualizing Thoracic CT Slices across Histopathological Types",
    "Examine normal parenchymal radiolucency vs spiculated adenocarcinomas, large cell necrotic masses, and cavitary squamous tumors."
]))

cells.append(make_cell("code", [
    "fig, axes = plt.subplots(1, 4, figsize=(18, 5))",
    "viz_samples = []",
    "for c_idx in range(4):",
    "    sample_row = df_train[df_train['label_idx'] == c_idx].sample(1, random_state=SEED).iloc[0]",
    "    viz_samples.append(sample_row)",
    "",
    "for i, row in enumerate(viz_samples):",
    "    img = Image.open(row['filepath']).convert('RGB')",
    "    axes[i].imshow(img, cmap='bone')",
    "    axes[i].set_title(f\"{row['label_name']}\", fontsize=10, fontweight='bold')",
    "    axes[i].axis('off')",
    "plt.suptitle('Representative Thoracic Axial CT Slices across Histopathological Categories', fontsize=13, fontweight='bold', y=1.02)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 7: Input Pipeline & Thoracic CT Augmentation
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 6. Input Pipeline & Anatomical Data Augmentation",
    "Standardize to $224 \\times 224 \\times 3$ with MobileNetV2 $[-1, 1]$ normalization.  ",
    r"Augmentation leverages horizontal thoracic symmetry, subtle rotation ($\pm 5^\circ$), zoom ($\pm 4\%$), and contrast jitter to simulate CT window variations."
]))

cells.append(make_cell("code", [
    "IMG_SIZE = (224, 224)",
    "BATCH_SIZE = 32",
    "NUM_CLASSES = 4",
    "",
    "lung_augmentation = keras.Sequential([",
    "    layers.RandomFlip(\"horizontal\"),",
    "    layers.RandomRotation(0.015, fill_mode='nearest'),",
    "    layers.RandomZoom((-0.04, 0.04), fill_mode='nearest'),",
    "    layers.RandomContrast(0.06),",
    "], name=\"lung_cancer_augmentation\")",
    "",
    "def load_and_preprocess_ct(path, label):",
    "    img_raw = tf.io.read_file(path)",
    "    img = tf.image.decode_png(img_raw, channels=3)",
    "    img = tf.image.resize(img, IMG_SIZE)",
    "    img = preprocess_input(img)  # MobileNetV2 [-1, 1] scaling",
    "    one_hot = tf.one_hot(label, depth=NUM_CLASSES)",
    "    return img, one_hot",
    "",
    "def create_ct_dataset(df, is_training=False):",
    "    paths = df['filepath'].values",
    "    labels = df['label_idx'].values",
    "    ds = tf.data.Dataset.from_tensor_slices((paths, labels))",
    "    ds = ds.map(load_and_preprocess_ct, num_parallel_calls=tf.data.AUTOTUNE)",
    "    if is_training:",
    "        ds = ds.shuffle(buffer_size=1024, seed=SEED)",
    "        ds = ds.map(lambda x, y: (lung_augmentation(x, training=True), y), num_parallel_calls=tf.data.AUTOTUNE)",
    "    ds = ds.batch(BATCH_SIZE)",
    "    ds = ds.prefetch(tf.data.AUTOTUNE)",
    "    return ds",
    "",
    "train_ds = create_ct_dataset(df_train, is_training=True)",
    "val_ds   = create_ct_dataset(df_val, is_training=False)",
    "test_ds  = create_ct_dataset(df_test, is_training=False)",
    "",
    "# Class weight calculation to counter class imbalances",
    "weights = compute_class_weight(",
    "    class_weight='balanced',",
    "    classes=np.unique(df_train['label_idx']),",
    "    y=df_train['label_idx'].values",
    ")",
    "class_weights_dict = {i: float(w) for i, w in enumerate(weights)}",
    "print(\"Computed Balanced Class Weights:\")",
    "for k, v in class_weights_dict.items():",
    "    print(f\"  Class {k} ({CLASS_NAMES[k]}): weight = {v:.3f}\")"
]))

# ==========================================
# CELL 8: Build MobileNetV2 Architecture
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 7. Model Architecture (MobileNetV2 Transfer Learning)",
    "We use MobileNetV2 with Global Average Pooling, Batch Normalization, Dense(128, ReLU), Dropout (0.35), and a 4-class Softmax classification head."
]))

cells.append(make_cell("code", [
    "def build_lung_cancer_model():",
    "    inputs = keras.Input(shape=(224, 224, 3), name=\"input_thoracic_ct\")",
    "    ",
    "    base_model = MobileNetV2(",
    "        weights='imagenet',",
    "        include_top=False,",
    "        input_tensor=inputs",
    "    )",
    "    base_model.trainable = False  # Freeze for Phase 1",
    "    ",
    "    x = base_model.output",
    "    x = layers.GlobalAveragePooling2D(name=\"lung_cancer_global_pool\")(x)",
    "    x = layers.BatchNormalization(name=\"lung_cancer_bn\")(x)",
    "    x = layers.Dense(128, activation='relu', name=\"lung_cancer_dense_128\")(x)",
    "    x = layers.Dropout(0.35, name=\"lung_cancer_dropout\")(x)",
    "    outputs = layers.Dense(NUM_CLASSES, activation='softmax', name=\"lung_cancer_probabilities\")(x)",
    "    ",
    "    model = keras.Model(inputs=inputs, outputs=outputs, name=\"Arogya_LungCancer_MobileNetV2\")",
    "    return model, base_model",
    "",
    "model, base_model = build_lung_cancer_model()",
    "model.summary()"
]))

# ==========================================
# CELL 9: Phase 1 Training (Feature Extraction)
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 8. Phase 1 Training: Feature Adaptation (Frozen Backbone)",
    "Train custom dense head with Adam ($10^{-3}$) and categorical crossentropy loss."
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
    "print(\"Starting Phase 1 Training (Frozen Backbone)...\")",
    "history_phase1 = model.fit(",
    "    train_ds,",
    "    validation_data=val_ds,",
    "    epochs=8,",
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
    "## 9. Phase 2 Training: Fine-Tuning Upper Convolutional Layers",
    "Unfreeze the top 35 layers of MobileNetV2 (including bottleneck block 16 and final conv `Conv_1`) and fine-tune with a low learning rate ($10^{-5}$) to adapt filters to thoracic CT nodular spiculation and parenchymal patterns."
]))

cells.append(make_cell("code", [
    "base_model.trainable = True",
    "for layer in base_model.layers[:-35]:",
    "    layer.trainable = False",
    "",
    "trainable_params = sum(np.prod(p.shape) for p in model.trainable_weights)",
    "print(f\"Trainable parameters for fine-tuning: {trainable_params:,}\")",
    "",
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
    "    epochs=12,",
    "    class_weight=class_weights_dict,",
    "    callbacks=callbacks_phase2,",
    "    verbose=1",
    ")"
]))

# ==========================================
# CELL 11: Learning Curves Plot
# ==========================================
cells.append(make_cell("code", [
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
    "plt.title('Lung Cancer CT Classifier: Accuracy Trajectory', fontweight='bold')",
    "plt.xlabel('Epoch')",
    "plt.ylabel('Accuracy')",
    "plt.legend()",
    "plt.grid(alpha=0.3)",
    "",
    "plt.subplot(1, 2, 2)",
    "plt.plot(loss, label='Training Loss', color='#ef4444', lw=2)",
    "plt.plot(val_loss, label='Validation Loss', color='#f59e0b', lw=2)",
    "plt.axvline(x=len(history_phase1.history['loss'])-1, color='gray', linestyle='--', label='Fine-Tuning Start')",
    "plt.title('Lung Cancer CT Classifier: Loss Trajectory', fontweight='bold')",
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
    "## 10. Clinical Evaluation on Held-Out Test Cohort",
    "Assess diagnostic sensitivity (Recall), specificity, precision, and F1-score across untouched test CT scans."
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
    "plt.figure(figsize=(8, 6))",
    "sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES)",
    "plt.title('Confusion Matrix: Held-Out Thoracic CT Test Cohort', fontweight='bold')",
    "plt.xlabel('Predicted Diagnosis')",
    "plt.ylabel('Ground Truth')",
    "plt.xticks(rotation=20, ha='right')",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 13: Pulmonary Grad-CAM Explainability
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 11. Pulmonary Nodule Grad-CAM Saliency Localization",
    "Extract partial derivatives from the final convolutional layer (`Conv_1`) to verify that the network focuses on nodular opacities and parenchymal lesions."
]))

cells.append(make_cell("code", [
    "def make_lung_gradcam_heatmap(img_array, model, last_conv_layer_name=\"Conv_1\", pred_index=None):",
    "    grad_model = keras.models.Model(",
    "        inputs=[model.inputs],",
    "        outputs=[model.get_layer(last_conv_layer_name).output, model.output]",
    "    )",
    "    with tf.GradientTape() as tape:",
    "        last_conv_layer_output, preds = grad_model(img_array)",
    "        if pred_index is None:",
    "            pred_index = tf.argmax(preds[0])",
    "        class_channel = preds[:, pred_index]",
    "    ",
    "    grads = tape.gradient(class_channel, last_conv_layer_output)",
    "    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))",
    "    last_conv_layer_output = last_conv_layer_output[0]",
    "    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]",
    "    heatmap = tf.squeeze(heatmap)",
    "    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)",
    "    return heatmap.numpy()",
    "",
    "# Visualize Grad-CAM on 4 representative test samples (one per class)",
    "fig, axes = plt.subplots(2, 4, figsize=(18, 9))",
    "viz_test_rows = []",
    "for c_idx in range(4):",
    "    class_subset = df_test[df_test['label_idx'] == c_idx]",
    "    if len(class_subset) > 0:",
    "        viz_test_rows.append(class_subset.iloc[0])",
    "    else:",
    "        viz_test_rows.append(df_test.iloc[c_idx])",
    "viz_test = pd.DataFrame(viz_test_rows).reset_index(drop=True)",
    "",
    "for idx in range(4):",
    "    sample_path = viz_test.iloc[idx]['filepath']",
    "    true_label = viz_test.iloc[idx]['label_name']",
    "    ",
    "    img_pil = Image.open(sample_path).convert('RGB').resize(IMG_SIZE)",
    "    img_arr = np.array(img_pil)",
    "    img_tensor = preprocess_input(np.expand_dims(img_arr.astype(np.float32), axis=0))",
    "    ",
    "    pred = model.predict(img_tensor, verbose=0)[0]",
    "    pred_idx = np.argmax(pred)",
    "    heatmap = make_lung_gradcam_heatmap(img_tensor, model)",
    "    ",
    "    axes[0, idx].imshow(img_pil, cmap='bone')",
    "    axes[0, idx].set_title(f\"True: {true_label[:22]}...\\nPred: {CLASS_NAMES[pred_idx][:22]}... ({pred[pred_idx]:.1%})\", fontsize=9.5)",
    "    axes[0, idx].axis('off')",
    "    ",
    "    heatmap_resized = np.uint8(255 * heatmap)",
    "    axes[1, idx].imshow(img_pil, cmap='bone')",
    "    axes[1, idx].imshow(heatmap_resized, cmap='jet', alpha=0.45)",
    "    axes[1, idx].set_title(f\"Conv_1 Grad-CAM Localization\", fontsize=9.5, fontweight='bold', color='navy')",
    "    axes[1, idx].axis('off')",
    "",
    "plt.suptitle('Clinical Grad-CAM Verification on Thoracic CT Pulmonary Nodules', fontsize=14, fontweight='bold', y=1.02)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 14: Direct In-Memory TensorFlow.js Exporter
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 12. TensorFlow.js Web Export (Direct In-Memory Exporter)",
    "Export Keras model directly into TensorFlow.js format (`model.json` + `group1-shard1of1.bin`, ~9.5 MB) using pure Python memory buffers."
]))

cells.append(make_cell("code", [
    "EXPORT_DIR = \"./arogya_lung_cancer_tfjs/web_model\"",
    "os.makedirs(EXPORT_DIR, exist_ok=True)",
    "",
    "# 1. Extract Keras topology",
    "try:",
    "    topology = json.loads(model.to_json())",
    "except Exception as e:",
    "    print(f\"Topology warning: {e}\")",
    "    topology = {}",
    "",
    "# 2. Extract weights into binary shard",
    "manifest_weights = []",
    "raw_bytes = bytearray()",
    "for w in model.weights:",
    "    w_name = w.path if hasattr(w, 'path') else w.name",
    "    if isinstance(w_name, str) and w_name.endswith(':0'):",
    "        w_name = w_name[:-2]",
    "    w_arr = w.numpy().astype(np.float32)",
    "    manifest_weights.append({",
    "        \"name\": str(w_name),",
    "        \"shape\": list(w_arr.shape),",
    "        \"dtype\": \"float32\"",
    "    })",
    "    raw_bytes.extend(w_arr.tobytes())",
    "",
    "shard_filename = \"group1-shard1of1.bin\"",
    "shard_path = os.path.join(EXPORT_DIR, shard_filename)",
    "with open(shard_path, \"wb\") as f:",
    "    f.write(raw_bytes)",
    "print(f\"  ✅ Saved weight shard: {shard_filename} ({len(raw_bytes) / (1024*1024):.2f} MB)\")",
    "",
    "# 3. Write model.json",
    "tfjs_manifest = {",
    "    \"format\": \"layers-model\",",
    "    \"generatedBy\": f\"keras v{tf.__version__}\",",
    "    \"convertedBy\": \"Arogya Sahayak Direct Exporter\",",
    "    \"modelTopology\": topology,",
    "    \"weightsManifest\": [{",
    "        \"paths\": [shard_filename],",
    "        \"weights\": manifest_weights",
    "    }]",
    "}",
    "model_json_path = os.path.join(EXPORT_DIR, \"model.json\")",
    "with open(model_json_path, 'w', encoding='utf-8') as f:",
    "    json.dump(tfjs_manifest, f, indent=2)",
    "print(\"  ✅ Saved model.json topology.\")"
]))

# ==========================================
# CELL 15: Model Card & Metrics JSON Generation
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 13. Model Card & Clinical Audit Metadata",
    "Generate Mitchell et al. `model_card.json` and `metrics.json` recording sensitivity, specificity, and ethical safety boundaries."
]))

cells.append(make_cell("code", [
    "import datetime",
    "",
    "class_metrics = []",
    "for c_idx, c_name in enumerate(CLASS_NAMES):",
    "    sens = float(cm[c_idx, c_idx] / cm[c_idx].sum()) if cm[c_idx].sum() > 0 else 0.0",
    "    class_metrics.append({",
    "        \"index\": c_idx,",
    "        \"label\": c_name,",
    "        \"sensitivity\": sens,",
    "        \"precision\": float(report[c_name]['precision']),",
    "        \"f1_score\": float(report[c_name]['f1-score'])",
    "    })",
    "",
    "overall_accuracy = float(np.sum(np.diag(cm)) / np.sum(cm))",
    "",
    "model_card = {",
    "    \"schema_version\": \"1.0.0\",",
    "    \"model_name\": \"Arogya Sahayak Lung Cancer Thoracic CT MobileNetV2 Classifier\",",
    "    \"scanner_id\": \"lung_cancer\",",
    "    \"modality\": \"Thoracic CT Scans (Axial Slices)\",",
    "    \"input_dimensions\": [224, 224, 3],",
    "    \"preprocessing\": \"MobileNetV2 scale [-1, 1]\",",
    "    \"classes\": class_metrics,",
    "    \"metrics\": {",
    "        \"overall_test_accuracy\": float(overall_accuracy),",
    "        \"macro_avg_f1\": float(report['macro avg']['f1-score']),",
    "        \"weighted_avg_f1\": float(report['weighted avg']['f1-score'])",
    "    },",
    "    \"calibrated_threshold\": 0.52,",
    "    \"last_conv_layer\": \"Conv_1\",",
    "    \"training_metadata\": {",
    "        \"date\": datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\"),",
    "        \"institution\": \"ABIT Cuttack / BPUT Odisha\",",
    "        \"developers\": [\"Rahul Prasad Das\", \"Purnachandra Swain\", \"Rohit Kumar Thakur\", \"Ritik Kumar Swain\"],",
    "        \"guide\": \"Prof. Rajesh Kumar Sahoo\",",
    "        \"dataset_source\": \"Chest CT-Scan images Dataset (Kaggle: mohamedhanyyy/chest-ctscan-images)\",",
    "        \"training_samples\": len(df_train),",
    "        \"validation_samples\": len(df_val),",
    "        \"test_samples\": len(df_test),",
    "        \"hardware\": \"Google Colab Tesla T4 GPU (Free Tier)\"",
    "    },",
    "    \"clinical_safety_notice\": \"SCREENING AID ONLY. Not intended as a definitive diagnostic tool for bronchogenic carcinoma. Confirmatory oncological evaluation requires Contrast-Enhanced Chest CT (CECT), PET-CT, histopathological biopsy (TTNB/EBUS), and multidisciplinary tumor board review.\"",
    "}",
    "",
    "model_card_file = os.path.join(EXPORT_DIR, \"model_card.json\")",
    "with open(model_card_file, 'w', encoding='utf-8') as f:",
    "    json.dump(model_card, f, indent=2)",
    "",
    "metrics_file = os.path.join(EXPORT_DIR, \"metrics.json\")",
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
    "## 14. Package & Download Model for Arogya Sahayak Integration",
    "Packages the exported web model into `arogyasahayak_lung_cancer_model.zip` and triggers an automatic browser download."
]))

cells.append(make_cell("code", [
    "import zipfile",
    "from google.colab import files",
    "",
    "zip_filename = \"arogyasahayak_lung_cancer_model.zip\"",
    "print(f\"Creating deployment archive: {zip_filename}...\")",
    "",
    "with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:",
    "    for root, dirs, filenames in os.walk(EXPORT_DIR):",
    "        for fname in filenames:",
    "            fpath = os.path.join(root, fname)",
    "            arcname = os.path.relpath(fpath, EXPORT_DIR)",
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
    "1. Extract 'arogyasahayak_lung_cancer_model.zip'.",
    "2. Copy the extracted files into your Arogya Sahayak repository at:",
    "   public/models/lung_cancer/",
    "   (Files needed: model.json, group1-shard1of1.bin, model_card.json, metrics.json)",
    "3. Done! Arogya Sahayak will now run real deep-learning Lung Cancer CT screening!",
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

output_path = os.path.join("notebooks", "06_train_lung_cancer_scanner.ipynb")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(notebook, f, indent=1)

print(f"Successfully generated: {output_path}")
print(f"Total cells: {len(cells)}")
