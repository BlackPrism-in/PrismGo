// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'named_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$NamedDtoCWProxy {
  NamedDto id(String id);

  NamedDto name(String name);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `NamedDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// NamedDto(...).copyWith(id: 12, name: "My name")
  /// ````
  NamedDto call({String id, String name});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfNamedDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfNamedDto.copyWith.fieldName(...)`
class _$NamedDtoCWProxyImpl implements _$NamedDtoCWProxy {
  const _$NamedDtoCWProxyImpl(this._value);

  final NamedDto _value;

  @override
  NamedDto id(String id) => this(id: id);

  @override
  NamedDto name(String name) => this(name: name);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `NamedDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// NamedDto(...).copyWith(id: 12, name: "My name")
  /// ````
  NamedDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
  }) {
    return NamedDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
    );
  }
}

extension $NamedDtoCopyWith on NamedDto {
  /// Returns a callable class that can be used as follows: `instanceOfNamedDto.copyWith(...)` or like so:`instanceOfNamedDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$NamedDtoCWProxy get copyWith => _$NamedDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NamedDto _$NamedDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('NamedDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name']);
      final val = NamedDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$NamedDtoToJson(NamedDto instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
};
