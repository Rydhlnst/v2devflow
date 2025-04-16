import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LANGUAGE_NAMES } from '@/constants/language';

const LanguageSelector = ({ setLanguage }: { setLanguage: (language: string) => void }) => {
  const [language, setLanguageLocal] = useState("Bahasa Indonesia");

  return (
    <div>
      <Select value={language} onValueChange={(val) => { setLanguageLocal(val); setLanguage(val); }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGE_NAMES.map((lang, index) => (
            <SelectItem key={index} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
