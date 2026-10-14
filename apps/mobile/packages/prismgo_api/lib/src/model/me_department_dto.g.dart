// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'me_department_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$MeDepartmentDtoCWProxy {
  MeDepartmentDto id(String id);

  MeDepartmentDto name(String name);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `MeDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// MeDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  MeDepartmentDto call({String id, String name});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfMeDepartmentDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfMeDepartmentDto.copyWith.fieldName(...)`
class _$MeDepartmentDtoCWProxyImpl implements _$MeDepartmentDtoCWProxy {
  const _$MeDepartmentDtoCWProxyImpl(this._value);

  final MeDepartmentDto _value;

  @override
  MeDepartmentDto id(String id) => this(id: id);

  @override
  MeDepartmentDto name(String name) => this(name: name);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `MeDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// MeDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  MeDepartmentDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
  }) {
    return MeDepartmentDto(
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

extension $MeDepartmentDtoCopyWith on MeDepartmentDto {
  /// Returns a callable class that can be used as follows: `instanceOfMeDepartmentDto.copyWith(...)` or like so:`instanceOfMeDepartmentDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$MeDepartmentDtoCWProxy get copyWith => _$MeDepartmentDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MeDepartmentDto _$MeDepartmentDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('MeDepartmentDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name']);
      final val = MeDepartmentDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$MeDepartmentDtoToJson(MeDepartmentDto instance) =>
    <String, dynamic>{'id': instance.id, 'name': instance.name};
