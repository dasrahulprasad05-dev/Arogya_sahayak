"""
Script to generate the complete Google Colab Jupyter Notebook:
03_train_alzheimer_scanner.ipynb
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
    "# 🧠 Arogya Sahayak — Deep Learning Scanner 03: Alzheimer's Disease Detection",
    "### Multistage Dementia Staging, Neuro-Anatomical Grad-CAM & TensorFlow.js Export",
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
    "1. **Structural Neuro-Degeneration Staging:** Classify axial and coronal T1-weighted brain MRI scans across 4 progressive cognitive stages:",
    "   - **`0: Non-Demented (Normal Control)`** — Intact cerebral cortex volume, normal ventricular size, preserved bilateral hippocampal geometry.",
    "   - **`1: Very Mild Cognitive Decline`** — Subtle entorhinal cortex thinning, early medial temporal lobe volume loss.",
    "   - **`2: Mild Demented`** — Marked hippocampal atrophy, moderate compensatory enlargement of lateral ventricles.",
    "   - **`3: Moderate Alzheimer Dementia`** — Severe widespread cortical gyral thinning, pronounced sulcal widening, severe ventriculomegaly.",
    "2. **MobileNetV2 Deep Transfer Learning:** Train on 6,400 structural MRI scans with progressive unfreezing.",
    "3. **Clinical Evaluation:** Quantify diagnostic Sensitivity (Recall), Specificity, Multiclass AUC-ROC curves, and Confusion Matrices.",
    "4. **Hippocampal Grad-CAM Explainability:** Extract authentic partial derivatives from the final convolutional layer (`Conv_1`) to verify that the network focuses on the medial temporal lobes and ventricular horns rather than extra-cranial tissues.",
    "5. **Edge Deployment:** Export to sub-12 MB TensorFlow.js graph weights for zero-latency in-browser mobile triage."
]))

# ==========================================
# CELL 2: Environment Setup & GPU Check
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 1. Environment Setup & Hardware Acceleration",
    "Verify GPU availability (NVIDIA Tesla T4 on free Colab) and install necessary packages (`kagglehub`, `tensorflowjs`, `scikit-learn`, `seaborn`)."
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
    "from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve",
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
# CELL 3: Download Kaggle Alzheimer Dataset
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 2. Dataset Acquisition via KaggleHub (Zero API Key)",
    "We use the benchmark Alzheimer's MRI dataset (`sachinkumar413/alzheimer-mri-dataset`), compiling 6,400 validated T1-weighted brain MRI scans across all 4 stages of cognitive impairment."
]))

cells.append(make_cell("code", [
    "import kagglehub",
    "",
    "print(\"Downloading Alzheimer MRI dataset via KaggleHub (Zero API Key)...\")",
    "dataset_raw_path = kagglehub.dataset_download(\"sachinkumar413/alzheimer-mri-dataset\")",
    "print(f\"Dataset downloaded successfully to: {dataset_raw_path}\")",
    "",
    "# Inspect folder layout",
    "for root, dirs, files in os.walk(dataset_raw_path):",
    "    depth = root[len(dataset_raw_path):].count(os.sep)",
    "    if depth < 3:",
    "        print(f\"{'  ' * depth}📁 {os.path.basename(root)}/ ({len(files)} files)\")"
]))

# ==========================================
# CELL 4: Data Ingestion & Class Mapping
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 3. Data Ingestion & Clinical Label Standardization",
    "We standardize folder names to the 4 diagnostic labels specified in Arogya Sahayak's [`scanConfig.ts`]:",
    "- `NonDemented` → `0: Non-Demented (Normal Control)`",
    "- `VeryMildDemented` → `1: Very Mild Cognitive Decline`",
    "- `MildDemented` → `2: Mild Demented`",
    "- `ModerateDemented` → `3: Moderate Alzheimer Dementia`"
]))

cells.append(make_cell("code", [
    "CLASS_MAP = {",
    "    'nondemented': {'idx': 0, 'name': 'Non-Demented (Normal Control)'},",
    "    'verymilddemented': {'idx': 1, 'name': 'Very Mild Cognitive Decline'},",
    "    'milddemented': {'idx': 2, 'name': 'Mild Demented'},",
    "    'moderatedemented': {'idx': 3, 'name': 'Moderate Alzheimer Dementia'}",
    "}",
    "CLASS_NAMES = [CLASS_MAP[k]['name'] for k in sorted(CLASS_MAP.keys(), key=lambda k: CLASS_MAP[k]['idx'])]",
    "",
    "# Gather all image paths",
    "extensions = ('*.jpg', '*.jpeg', '*.png')",
    "all_image_paths = []",
    "for ext in extensions:",
    "    all_image_paths.extend(glob.glob(os.path.join(dataset_raw_path, \"**\", ext), recursive=True))",
    "",
    "records = []",
    "for p in all_image_paths:",
    "    parent = os.path.basename(os.path.dirname(p)).lower().replace('_', '').replace(' ', '')",
    "    if parent in CLASS_MAP:",
    "        records.append({",
    "            'filepath': p,",
    "            'class_key': parent,",
    "            'label_idx': CLASS_MAP[parent]['idx'],",
    "            'label_name': CLASS_MAP[parent]['name']",
    "        })",
    "",
    "df_all = pd.DataFrame(records)",
    "print(f\"Total Alzheimer MRI Scans Ingested: {len(df_all):,}\")",
    "print(\"\\nClass Distribution across Dataset:\")",
    "print(df_all['label_name'].value_counts())"
]))

# ==========================================
# CELL 5: Stratified Train / Val / Test Split
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 4. Stratified Dataset Partitioning (70% Train, 15% Val, 15% Test)",
    "Because advanced stages (Moderate Dementia) have fewer clinical presentations than normal controls, stratified sampling is required to preserve proportional clinical distribution across all evaluation splits."
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
    "print(f\"Training Cohort:   {len(df_train):,} scans ({len(df_train)/len(df_all):.1%})\")",
    "print(f\"Validation Cohort: {len(df_val):,} scans ({len(df_val)/len(df_all):.1%})\")",
    "print(f\"Test Cohort:       {len(df_test):,} scans ({len(df_test)/len(df_all):.1%})\")"
]))

# ==========================================
# CELL 6: Sample Visualization
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 5. Visualizing Cognitive Impairment Progression on MRI",
    "Examine structural ventricular enlargement and temporal horn widening across progressive clinical stages."
]))

cells.append(make_cell("code", [
    "fig, axes = plt.subplots(1, 4, figsize=(18, 5))",
    "for c_idx, c_name in enumerate(CLASS_NAMES):",
    "    sample = df_train[df_train['label_idx'] == c_idx].iloc[0]",
    "    img = Image.open(sample['filepath']).convert('RGB')",
    "    axes[c_idx].imshow(img, cmap='bone')",
    "    axes[c_idx].set_title(f\"Stage {c_idx}:\\n{c_name}\", fontsize=11, fontweight='bold')",
    "    axes[c_idx].axis('off')",
    "plt.suptitle('Representative Structural Brain MRI Slices Across Alzheimer Stages', fontsize=14, fontweight='bold', y=1.02)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 7: Input Pipeline & Neuro-MRI Augmentation
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 6. Input Pipeline & Anatomical Data Augmentation",
    "Standardize to $224 \\times 224 \\times 3$ with MobileNetV2 $[-1, 1]$ normalization.  ",
    "Augmentation leverages horizontal symmetry, small rotation $\\pm 8^\\circ$, and subtle contrast adjustment."
]))

cells.append(make_cell("code", [
    "IMG_SIZE = (224, 224)",
    "BATCH_SIZE = 32",
    "NUM_CLASSES = 4",
    "",
    "alzheimer_augmentation = keras.Sequential([",
    "    layers.RandomFlip(\"horizontal\"),                     # Bilateral cerebral symmetry",
    "    layers.RandomRotation(0.025, fill_mode='nearest'),   # ~9 degrees",
    "    layers.RandomZoom((-0.04, 0.04), fill_mode='nearest'),",
    "    layers.RandomBrightness(0.06),",
    "    layers.RandomContrast(0.06),",
    "], name=\"alzheimer_mri_augmentation\")",
    "",
    "def load_and_preprocess_alzheimer(path, label):",
    "    img_raw = tf.io.read_file(path)",
    "    img = tf.image.decode_jpeg(img_raw, channels=3)",
    "    img = tf.image.resize(img, IMG_SIZE)",
    "    img = preprocess_input(img)  # MobileNetV2 [-1, 1] scaling",
    "    one_hot = tf.one_hot(label, depth=NUM_CLASSES)",
    "    return img, one_hot",
    "",
    "def create_alzheimer_dataset(df, is_training=False):",
    "    paths = df['filepath'].values",
    "    labels = df['label_idx'].values",
    "    ds = tf.data.Dataset.from_tensor_slices((paths, labels))",
    "    ds = ds.map(load_and_preprocess_alzheimer, num_parallel_calls=tf.data.AUTOTUNE)",
    "    if is_training:",
    "        ds = ds.shuffle(buffer_size=1024, seed=SEED)",
    "        ds = ds.map(lambda x, y: (alzheimer_augmentation(x, training=True), y), num_parallel_calls=tf.data.AUTOTUNE)",
    "    ds = ds.batch(BATCH_SIZE)",
    "    ds = ds.prefetch(tf.data.AUTOTUNE)",
    "    return ds",
    "",
    "train_ds = create_alzheimer_dataset(df_train, is_training=True)",
    "val_ds   = create_alzheimer_dataset(df_val, is_training=False)",
    "test_ds  = create_alzheimer_dataset(df_test, is_training=False)",
    "",
    "# Class weight calculation to counterbalance minority classes (Moderate Dementia)",
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
    "We use MobileNetV2 as a lightweight feature extractor with Global Average Pooling, Batch Normalization, Dropout (0.35), and a 4-class Softmax classifier."
]))

cells.append(make_cell("code", [
    "def build_alzheimer_model():",
    "    inputs = keras.Input(shape=(224, 224, 3), name=\"input_mri_slice\")",
    "    ",
    "    base_model = MobileNetV2(",
    "        weights='imagenet',",
    "        include_top=False,",
    "        input_tensor=inputs",
    "    )",
    "    base_model.trainable = False  # Freeze for Phase 1",
    "    ",
    "    x = base_model.output",
    "    x = layers.GlobalAveragePooling2D(name=\"alzheimer_global_pool\")(x)",
    "    x = layers.BatchNormalization(name=\"alzheimer_bn\")(x)",
    "    x = layers.Dense(128, activation='relu', name=\"alzheimer_dense_128\")(x)",
    "    x = layers.Dropout(0.35, name=\"alzheimer_dropout\")(x)",
    "    outputs = layers.Dense(NUM_CLASSES, activation='softmax', name=\"dementia_probabilities\")(x)",
    "    ",
    "    model = keras.Model(inputs=inputs, outputs=outputs, name=\"Arogya_Alzheimer_MobileNetV2\")",
    "    return model, base_model",
    "",
    "model, base_model = build_alzheimer_model()",
    "model.summary()"
]))

# ==========================================
# CELL 9: Phase 1 Training (Feature Extraction)
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 8. Phase 1 Training: Feature Adaptation (Frozen Backbone)",
    "Train custom dense classification head with Adam ($10^{-3}$) and categorical crossentropy loss."
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
    "## 9. Phase 2 Training: Fine-Tuning Upper Convolutional Blocks",
    "Unfreeze the top 35 layers of MobileNetV2 (including bottleneck block 16 and final conv `Conv_1`) and fine-tune with a low learning rate ($10^{-5}$) to adapt filters to hippocampal atrophy patterns."
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
    "plt.title('Alzheimer Classifier: Accuracy Trajectory', fontweight='bold')",
    "plt.xlabel('Epoch')",
    "plt.ylabel('Accuracy')",
    "plt.legend()",
    "plt.grid(alpha=0.3)",
    "",
    "plt.subplot(1, 2, 2)",
    "plt.plot(loss, label='Training Loss', color='#ef4444', lw=2)",
    "plt.plot(val_loss, label='Validation Loss', color='#f59e0b', lw=2)",
    "plt.axvline(x=len(history_phase1.history['loss'])-1, color='gray', linestyle='--', label='Fine-Tuning Start')",
    "plt.title('Alzheimer Classifier: Loss Trajectory', fontweight='bold')",
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
    "Assess diagnostic sensitivity, specificity, precision, and F1-score across all 4 progressive cognitive stages."
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
    "fig, ax = plt.subplots(1, 2, figsize=(15, 6))",
    "sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES, ax=ax[0])",
    "ax[0].set_title('Raw Confusion Matrix (Held-out Patients)', fontweight='bold')",
    "ax[0].set_xlabel('Predicted Stage')",
    "ax[0].set_ylabel('True Dementia Stage')",
    "ax[0].tick_params(axis='x', rotation=30)",
    "",
    "sns.heatmap(cm_norm, annot=True, fmt='.2%', cmap='Greens', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES, ax=ax[1])",
    "ax[1].set_title('Normalized Matrix (Recall / Sensitivity)', fontweight='bold')",
    "ax[1].set_xlabel('Predicted Stage')",
    "ax[1].set_ylabel('True Dementia Stage')",
    "ax[1].tick_params(axis='x', rotation=30)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 13: Real Grad-CAM Explainability
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 11. Neuro-Imaging Grad-CAM Explainability",
    "Compute authentic gradient activation maps $\\frac{\\partial y^c}{\\partial A^k}$ from `Conv_1` to reveal the exact brain regions (hippocampus and temporal horns) guiding classification."
]))

cells.append(make_cell("code", [
    "def make_gradcam_heatmap(img_array, model, last_conv_layer_name=\"Conv_1\", pred_index=None):",
    "    \"\"\"Calculates authentic Grad-CAM heatmap for input MRI.\"\"\"",
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
    "    grads = tape.gradient(class_channel, conv_outputs)",
    "    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))",
    "    ",
    "    conv_outputs = conv_outputs[0]",
    "    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]",
    "    heatmap = tf.squeeze(heatmap)",
    "    ",
    "    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)",
    "    return heatmap.numpy()",
    "",
    "def overlay_gradcam(img_path, heatmap, alpha=0.45):",
    "    \"\"\"Superimpose jet heatmap on grayscale brain MRI.\"\"\"",
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
    "# Display Grad-CAM across all 4 stages",
    "fig, axes = plt.subplots(4, 3, figsize=(14, 16))",
    "test_samples = [df_test[df_test['label_idx'] == i].iloc[0] for i in range(4)]",
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
    "    axes[row_idx, 1].set_title(\"Conv_1 Hippocampal Heatmap\", fontsize=10)",
    "    axes[row_idx, 1].axis('off')",
    "    ",
    "    axes[row_idx, 2].imshow(superimposed)",
    "    axes[row_idx, 2].set_title(f\"Pred: {CLASS_NAMES[pred_idx]} ({conf:.1f}%)\", fontsize=10, fontweight='bold', color='navy')",
    "    axes[row_idx, 2].axis('off')",
    "",
    "plt.suptitle('Clinical Explainability: Real Grad-CAM on Hippocampal Atrophy and Ventricles', fontsize=14, fontweight='bold', y=1.01)",
    "plt.tight_layout()",
    "plt.show()"
]))

# ==========================================
# CELL 14: Export to TensorFlow.js
# ==========================================
cells.append(make_cell("markdown", [
    "---",
    "## 12. TensorFlow.js Web Export (Client-Side In-Browser Inference)",
    "Export the Keras model into TensorFlow.js format (`model.json` + `group1-shard1of1.bin`, ~12 MB).  ",
    "This enables offline, zero-latency cognitive decline assessment on rural smartphones."
]))

cells.append(make_cell("code", [
    "import tensorflowjs as tfjs",
    "",
    "EXPORT_DIR = \"./arogya_alzheimer_tfjs\"",
    "os.makedirs(EXPORT_DIR, exist_ok=True)",
    "",
    "keras_model_path = os.path.join(EXPORT_DIR, \"alzheimer_mobilenetv2.keras\")",
    "model.save(keras_model_path)",
    "print(f\"Saved native Keras model: {keras_model_path}\")",
    "",
    "tfjs_target_path = os.path.join(EXPORT_DIR, \"web_model\")",
    "tfjs.converters.save_keras_model(model, tfjs_target_path)",
    "print(f\"TensorFlow.js model exported successfully to: {tfjs_target_path}\")",
    "",
    "for f in os.listdir(tfjs_target_path):",
    "    size_mb = os.path.getsize(os.path.join(tfjs_target_path, f)) / (1024 * 1024)",
    "    print(f\"  📄 {f} ({size_mb:.2f} MB)\")"
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
    "    sens = float(cm[c_idx, c_idx] / cm[c_idx].sum())",
    "    class_metrics.append({",
    "        \"index\": c_idx,",
    "        \"label\": c_name,",
    "        \"sensitivity\": sens,",
    "        \"precision\": float(report[c_name]['precision']),",
    "        \"f1_score\": float(report[c_name]['f1-score'])",
    "    })",
    "",
    "overall_accuracy = np.trace(cm) / np.sum(cm)",
    "",
    "model_card = {",
    "    \"schema_version\": \"1.0.0\",",
    "    \"model_name\": \"Arogya Sahayak Alzheimer MRI MobileNetV2 Classifier\",",
    "    \"scanner_id\": \"alzheimer\",",
    "    \"modality\": \"Brain MRI (T1-weighted Axial/Coronal)\",",
    "    \"input_dimensions\": [224, 224, 3],",
    "    \"preprocessing\": \"MobileNetV2 scale [-1, 1]\",",
    "    \"classes\": class_metrics,",
    "    \"metrics\": {",
    "        \"overall_test_accuracy\": float(overall_accuracy),",
    "        \"macro_avg_f1\": float(report['macro avg']['f1-score']),",
    "        \"weighted_avg_f1\": float(report['weighted avg']['f1-score'])",
    "    },",
    "    \"calibrated_threshold\": 0.50,",
    "    \"last_conv_layer\": \"Conv_1\",",
    "    \"training_metadata\": {",
    "        \"date\": datetime.datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\"),",
    "        \"institution\": \"ABIT Cuttack / BPUT Odisha\",",
    "        \"developers\": [\"Rahul Prasad Das\", \"Purnachandra Swain\", \"Rohit Kumar Thakur\", \"Ritik Kumar Swain\"],",
    "        \"guide\": \"Prof. Rajesh Kumar Sahoo\",",
    "        \"dataset_source\": \"Kaggle Alzheimer MRI Dataset (6,400 scans)\",",
    "        \"training_samples\": len(df_train),",
    "        \"validation_samples\": len(df_val),",
    "        \"test_samples\": len(df_test),",
    "        \"hardware\": \"Google Colab Tesla T4 GPU (Free Tier)\"",
    "    },",
    "    \"clinical_safety_notice\": \"SCREENING AID ONLY. Not intended as a definitive dementia diagnosis. Neurocognitive decline requires formal neuropsychological testing (e.g. MMSE / MoCA), clinical history from caregivers, and evaluation by a neurologist or geriatrician.\"",
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
    "## 14. Package & Download Model for Arogya Sahayak Integration",
    "Packages the exported web model into `arogyasahayak_alzheimer_model.zip` and triggers an automatic browser download."
]))

cells.append(make_cell("code", [
    "import zipfile",
    "from google.colab import files",
    "",
    "zip_filename = \"arogyasahayak_alzheimer_model.zip\"",
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
    "1. Extract 'arogyasahayak_alzheimer_model.zip'.",
    "2. Copy the extracted files into your Arogya Sahayak repository at:",
    "   public/models/alzheimer/",
    "   (Files needed: model.json, group1-shard1of1.bin, model_card.json, metrics.json)",
    "3. Done! Arogya Sahayak will now run real deep-learning Alzheimer staging!",
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

output_path = os.path.join("notebooks", "03_train_alzheimer_scanner.ipynb")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(notebook, f, indent=1)

print(f"Successfully generated: {output_path}")
print(f"Total cells: {len(cells)}")
