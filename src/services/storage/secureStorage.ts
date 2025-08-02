import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

export interface SecureStorageOptions {
  requireAuthentication?: boolean;
  accessGroup?: string;
  keychainService?: string;
}

export class SecureStorageService {
  private static instance: SecureStorageService;
  private encryptionKey: string | null = null;

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  private constructor() {
    this.initializeEncryptionKey();
  }

  private async initializeEncryptionKey(): Promise<void> {
    try {
      let key = await SecureStore.getItemAsync('encryption_key');
      if (!key) {
        key = await this.generateEncryptionKey();
        await SecureStore.setItemAsync('encryption_key', key, {
          requireAuthentication: false,
        });
      }
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Secure storage initialization failed');
    }
  }

  private async generateEncryptionKey(): Promise<string> {
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${Date.now()}-${Math.random()}`,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    return key;
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.encryptionKey + data,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    return Buffer.from(data).toString('base64') + '.' + digest;
  }

  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
    }

    const [encodedData, hash] = encryptedData.split('.');
    if (!encodedData || !hash) {
      throw new Error('Invalid encrypted data format');
    }
    const data = Buffer.from(encodedData, 'base64').toString();

    const expectedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.encryptionKey + data,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    if (hash !== expectedHash) {
      throw new Error('Data integrity check failed');
    }

    return data;
  }

  async setItem(key: string, value: string, options: SecureStorageOptions = {}): Promise<void> {
    try {
      const encryptedValue = await this.encrypt(value);

      const storeOptions: SecureStore.SecureStoreOptions = {
        requireAuthentication: options.requireAuthentication ?? false,
      };

      if (Platform.OS === 'ios') {
        if (options.accessGroup) {
          storeOptions.accessGroup = options.accessGroup;
        }
        if (options.keychainService) {
          storeOptions.keychainService = options.keychainService;
        }
      }

      await SecureStore.setItemAsync(key, encryptedValue, storeOptions);
    } catch (error) {
      console.error(`Failed to store item ${key}:`, error);
      throw new Error(`Secure storage write failed: ${key}`);
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = await SecureStore.getItemAsync(key);
      if (!encryptedValue) {
        return null;
      }

      return await this.decrypt(encryptedValue);
    } catch (error) {
      console.error(`Failed to retrieve item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw new Error(`Secure storage delete failed: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      await Promise.all(keys.map(key => this.removeItem(key)));
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw new Error('Secure storage clear failed');
    }
  }

  async hasItem(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

  private async getAllKeys(): Promise<string[]> {
    const keys: string[] = [];
    let index = 0;

    while (true) {
      try {
        const key = await SecureStore.getItemAsync(`key_${index}`);
        if (!key) break;
        keys.push(key);
        index++;
      } catch {
        break;
      }
    }

    return keys;
  }

  async setObject<T>(key: string, value: T, options?: SecureStorageOptions): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.setItem(key, jsonString, options);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const jsonString = await this.getItem(key);
    if (!jsonString) {
      return null;
    }

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }
}

export const secureStorage = SecureStorageService.getInstance();
