/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "face": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eyes8",
          "eyes9",
          "eyes10",
          "eyes11",
          "eyes12",
          "eyes1",
          "eyes2",
          "eyes3",
          "eyes4",
          "eyes5",
          "eyes6",
          "eyes7",
          "hjealm"
        ]
      },
      "default": [
        "eyes8",
        "eyes9",
        "eyes10",
        "eyes11",
        "eyes12",
        "eyes1",
        "eyes2",
        "eyes3",
        "eyes4",
        "eyes5",
        "eyes6",
        "eyes7",
        "hjealm"
      ]
    },
    "faceColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "cd1f4d",
        "fabe37",
        "ccd537",
        "7a88fe",
        "ff9b28",
        "bfdff3",
        "f991f4",
        "6ea2ff"
      ]
    }
  }
};
