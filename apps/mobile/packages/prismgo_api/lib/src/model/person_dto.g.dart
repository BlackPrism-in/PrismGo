// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'person_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$PersonDtoCWProxy {
  PersonDto id(String id);

  PersonDto name(String name);

  PersonDto phone(String phone);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `PersonDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// PersonDto(...).copyWith(id: 12, name: "My name")
  /// ````
  PersonDto call({String id, String name, String phone});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfPersonDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfPersonDto.copyWith.fieldName(...)`
class _$PersonDtoCWProxyImpl implements _$PersonDtoCWProxy {
  const _$PersonDtoCWProxyImpl(this._value);

  final PersonDto _value;

  @override
  PersonDto id(String id) => this(id: id);

  @override
  PersonDto name(String name) => this(name: name);

  @override
  PersonDto phone(String phone) => this(phone: phone);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `PersonDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// PersonDto(...).copyWith(id: 12, name: "My name")
  /// ````
  PersonDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
  }) {
    return PersonDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
      phone: phone == const $CopyWithPlaceholder()
          ? _value.phone
          // ignore: cast_nullable_to_non_nullable
          : phone as String,
    );
  }
}

extension $PersonDtoCopyWith on PersonDto {
  /// Returns a callable class that can be used as follows: `instanceOfPersonDto.copyWith(...)` or like so:`instanceOfPersonDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$PersonDtoCWProxy get copyWith => _$PersonDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PersonDto _$PersonDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('PersonDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name', 'phone']);
      final val = PersonDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$PersonDtoToJson(PersonDto instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'phone': instance.phone,
};
